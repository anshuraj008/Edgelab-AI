import { GoogleGenerativeAI } from "@google/generative-ai";
import { Experiment, MissingField, Assumption } from "@/types/research";
import { AIParseResponseSchema } from "@/lib/schema/experiment";

export interface ParseResult {
  experimentDraft: Experiment;
  missingFields: MissingField[];
  assumptions: Assumption[];
  readyToTest: boolean;
}

const SYSTEM_PROMPT = `
You are a quantitative trading research assistant specializing in converting natural language market hypotheses into structured, testable experiments.

Your core mission:
1. Turn vague, ambiguous market questions into precise, transparent research definitions.
2. NEVER hide assumptions or invent market data.
3. Distinguish clearly what the user explicitly said (source: 'user') from what you inferred (source: 'derived') and what is an assumption (source: 'assumption').
4. If a parameter is essential to execute a backtest (such as numeric threshold for "sharp fall", holding period in days, test date range), mark it as missing in missingFields with clear questions and suggestions.
5. NEVER fabricate backtest return metrics, historical win rates, or trading recommendations.

Output MUST be strict JSON matching this exact structure:
{
  "experimentDraft": {
    "id": "exp_<unique_id>",
    "originalQuery": "<the user query>",
    "instrument": { "value": "NIFTY", "source": "user" | "derived" | "assumption" },
    "timeframe": { "value": "daily", "source": "derived" },
    "entryCondition": {
      "value": {
        "type": "daily_return_drop",
        "thresholdPct": -1.0,
        "description": "Daily close falls by 1.0% or more"
      },
      "source": "assumption" | "user" | "derived"
    },
    "exitCondition": {
      "value": {
        "type": "time_exit",
        "holdingDays": 5,
        "description": "Exit position after 5 trading sessions"
      },
      "source": "assumption" | "user" | "derived"
    },
    "holdingPeriodDays": { "value": 5, "source": "assumption" | "user" | "derived" },
    "testPeriod": {
      "value": { "start": "2015-01-01", "end": "2024-12-31" },
      "source": "assumption" | "user" | "derived"
    },
    "costs": {
      "value": { "transactionBps": 10, "slippageBps": 5 },
      "source": "assumption"
    },
    "filters": [],
    "hypothesis": "Post-fall forward return is positive and exceeds unconditional benchmark baseline.",
    "status": "draft",
    "createdAt": "<ISO_timestamp>"
  },
  "missingFields": [
    {
      "key": "entryCondition",
      "question": "What percentage decline qualifies as a 'sharp fall'?",
      "whyImportant": "A numeric threshold is required to trigger reproducible entry signals.",
      "suggestedValue": 1.0,
      "type": "number",
      "options": [
        { "label": "1.0% drop", "value": 1.0 },
        { "label": "1.5% drop", "value": 1.5 },
        { "label": "2.0% drop", "value": 2.0 }
      ]
    },
    {
      "key": "holdingPeriodDays",
      "question": "How many trading sessions should the position be held before exiting?",
      "whyImportant": "Defines the exact forward horizon over which edge is measured.",
      "suggestedValue": 5,
      "type": "number",
      "options": [
        { "label": "3 days", "value": 3 },
        { "label": "5 days", "value": 5 },
        { "label": "10 days", "value": 10 }
      ]
    },
    {
      "key": "testPeriod",
      "question": "What historical time window would you like to evaluate?",
      "whyImportant": "Ensures the test covers multiple market regimes (bull, bear, volatile).",
      "suggestedValue": "2015-01-01 to 2024-12-31",
      "type": "select",
      "options": [
        { "label": "Full 10-Year History (2015-2024)", "value": "2015-01-01 to 2024-12-31" },
        { "label": "Recent 5 Years (2020-2024)", "value": "2020-01-01 to 2024-12-31" }
      ]
    }
  ],
  "assumptions": [
    {
      "field": "entryCondition",
      "value": "1.0% daily return drop",
      "reason": "Common baseline definition for single-day pullback in index products.",
      "riskIfIncorrect": "Setting threshold too loose dilutes signal; too tight causes small sample size."
    },
    {
      "field": "costs",
      "value": "10 bps transaction + 5 bps slippage (15 bps total)",
      "reason": "Standard institutional round-trip friction estimate for index futures/ETFs.",
      "riskIfIncorrect": "Ignoring slippage creates false optimism for weak trading edges."
    }
  ],
  "readyToTest": false
}
`;

export async function parseMarketQuestion(
  query: string,
  clarifications?: Record<string, string | number>
): Promise<ParseResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const prompt = `
${SYSTEM_PROMPT}

USER QUERY:
"${query}"

EXISTING CLARIFICATIONS:
${JSON.stringify(clarifications || {}, null, 2)}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsedJson = JSON.parse(text);

      const validated = AIParseResponseSchema.safeParse(parsedJson);
      if (validated.success) {
        return validated.data;
      }
      console.warn("Gemini output validation failed, retrying fallback:", validated.error);
    } catch (err) {
      console.error("Gemini API call failed, falling back to local engine:", err);
    }
  }

  // Deterministic fallback parser
  return createSemanticFallbackParse(query, clarifications);
}

function createSemanticFallbackParse(
  query: string,
  clarifications?: Record<string, string | number>
): ParseResult {
  const q = query.toLowerCase();
  const id = `exp_${Date.now()}`;
  const now = new Date().toISOString();

  // Detect Instrument
  let instrumentName = "NIFTY";
  let instrumentSource: "user" | "derived" | "assumption" = "assumption";
  if (q.includes("bank nifty") || q.includes("banknifty")) {
    instrumentName = "BANKNIFTY";
    instrumentSource = "user";
  } else if (q.includes("nifty 50") || q.includes("nifty")) {
    instrumentName = "NIFTY";
    instrumentSource = "user";
  } else if (q.includes("spx") || q.includes("s&p") || q.includes("spy")) {
    instrumentName = "S&P 500";
    instrumentSource = "user";
  }

  // Detect Drop Threshold
  let thresholdPct = -1.0;
  let thresholdSource: "user" | "derived" | "assumption" = "assumption";
  const dropMatch = q.match(/(\d+(\.\d+)?)%/);
  if (dropMatch) {
    thresholdPct = -Math.abs(parseFloat(dropMatch[1]));
    thresholdSource = "user";
  } else if (q.includes("crash") || q.includes("huge drop")) {
    thresholdPct = -2.0;
    thresholdSource = "derived";
  }

  // Detect Holding Period
  let holdingDays = 5;
  let holdingSource: "user" | "derived" | "assumption" = "assumption";
  const daysMatch = q.match(/(\d+)\s*(day|session|holding)/);
  if (daysMatch) {
    holdingDays = parseInt(daysMatch[1], 10);
    holdingSource = "user";
  } else if (q.includes("week")) {
    holdingDays = 5;
    holdingSource = "derived";
  }

  const experimentDraft: Experiment = {
    id,
    originalQuery: query,
    instrument: {
      value: instrumentName,
      source: instrumentSource,
      reason: instrumentSource === "user" ? "Explicitly mentioned in query" : "Defaulted to benchmark index",
    },
    timeframe: {
      value: "daily",
      source: "derived",
      reason: "Daily timeframe derived from standard swing research questions",
    },
    entryCondition: {
      value: {
        type: "daily_return_drop",
        thresholdPct,
        description: `Daily close falls by ${Math.abs(thresholdPct)}% or more`,
      },
      source: thresholdSource,
      reason: thresholdSource === "user" ? "Explicit percentage specified" : "Assumed standard 1.0% drop for pullback testing",
    },
    exitCondition: {
      value: {
        type: "time_exit",
        holdingDays,
        description: `Exit position after ${holdingDays} trading sessions`,
      },
      source: holdingSource,
      reason: "Time-based exit after specified holding horizon",
    },
    holdingPeriodDays: {
      value: holdingDays,
      source: holdingSource,
    },
    testPeriod: {
      value: { start: "2015-01-01", end: "2024-12-31" },
      source: "assumption",
      reason: "10-year test period provides sample across diverse market regimes",
    },
    costs: {
      value: { transactionBps: 10, slippageBps: 5 },
      source: "assumption",
      reason: "15 bps round-trip friction reflects realistic index ETF/futures execution",
    },
    filters: [],
    hypothesis: `Buying ${instrumentName} after a ${Math.abs(thresholdPct)}% single-day drop yields positive forward returns over a ${holdingDays}-day horizon that outperform unconditional baseline drift.`,
    status: "draft",
    createdAt: now,
  };

  const missingFields: MissingField[] = [];

  if (thresholdSource !== "user") {
    missingFields.push({
      key: "entryCondition",
      question: "What percentage decline qualifies as a 'sharp fall'?",
      whyImportant: "A quantitative threshold is necessary to identify reproducible entry trigger dates.",
      suggestedValue: 1.0,
      type: "number",
      options: [
        { label: "1.0% drop", value: 1.0 },
        { label: "1.5% drop", value: 1.5 },
        { label: "2.0% drop", value: 2.0 },
      ],
    });
  }

  if (holdingSource !== "user") {
    missingFields.push({
      key: "holdingPeriodDays",
      question: "How many trading sessions should the position be held?",
      whyImportant: "The holding duration determines outcome window and trade overlap.",
      suggestedValue: 5,
      type: "number",
      options: [
        { label: "3 days", value: 3 },
        { label: "5 days", value: 5 },
        { label: "10 days", value: 10 },
      ],
    });
  }

  missingFields.push({
    key: "testPeriod",
    question: "What historical test window would you like to evaluate?",
    whyImportant: "Ensures sample includes bull markets, crashes, and rangebound phases.",
    suggestedValue: "2015-01-01 to 2024-12-31",
    type: "daterange",
    options: [
      { label: "10 Years (2015 - 2024)", value: "2015-01-01 to 2024-12-31" },
      { label: "5 Years (2020 - 2024)", value: "2020-01-01 to 2024-12-31" },
    ],
  });

  const assumptions: Assumption[] = [
    {
      field: "entryCondition",
      value: `${Math.abs(thresholdPct)}% daily drop`,
      reason: "Common baseline definition for single-day pullback in index products.",
      riskIfIncorrect: "Too loose dilutes signal; too tight creates statistically fragile small samples.",
    },
    {
      field: "costs",
      value: "10 bps transaction fees + 5 bps slippage (15 bps total)",
      reason: "Realistic friction for index futures and liquid ETF execution.",
      riskIfIncorrect: "Zero friction assumptions severely overstate backtest profitability.",
    },
    {
      field: "executionTiming",
      value: "Enter next session open",
      reason: "Eliminates look-ahead bias from using same-day closing price.",
      riskIfIncorrect: "Same-bar close entries create unrealistic execution assumptions.",
    },
  ];

  return {
    experimentDraft,
    missingFields,
    assumptions,
    readyToTest: missingFields.length === 0,
  };
}
