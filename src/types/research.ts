/**
 * AI Trading Research Assistant Core Types
 * Follows the 5-Stage Workbench Architecture: ASK -> CLARIFY -> DEFINE -> TEST -> LEARN
 */

export type Stage = "ask" | "clarify" | "define" | "test" | "learn";

export type ProvenanceSource = "user" | "assumption" | "clarified" | "derived";

export interface ProvenanceItem<T> {
  value: T;
  source: ProvenanceSource;
  confidence?: number;
  reason?: string;
  userEdited?: boolean;
}

export interface MissingField {
  key: "instrument" | "entryCondition" | "holdingPeriodDays" | "testPeriod" | "transactionBps" | "slippageBps";
  question: string;
  whyImportant: string;
  suggestedValue: string | number;
  type: "string" | "number" | "select" | "daterange";
  options?: { label: string; value: string | number }[];
}

export interface Assumption {
  field: string;
  value: string | number;
  reason: string;
  riskIfIncorrect: string;
}

export interface FilterCondition {
  name: string;
  value: string;
  enabled: boolean;
}

export interface Experiment {
  id: string;
  originalQuery: string;
  instrument: ProvenanceItem<string>;
  timeframe: ProvenanceItem<"daily" | "hourly">;
  entryCondition: ProvenanceItem<{
    type: string; // e.g. "daily_return_drop"
    thresholdPct: number; // e.g. -1.0 (-1%)
    description: string; // e.g. "Daily close falls by 1.0% or more"
  }>;
  exitCondition: ProvenanceItem<{
    type: "time_exit" | "stop_or_target";
    holdingDays: number; // e.g. 5
    description: string;
  }>;
  holdingPeriodDays: ProvenanceItem<number>;
  testPeriod: ProvenanceItem<{
    start: string; // "2015-01-01"
    end: string;   // "2024-12-31"
  }>;
  costs: ProvenanceItem<{
    transactionBps: number; // e.g. 10 bps
    slippageBps: number;     // e.g. 5 bps
  }>;
  filters: FilterCondition[];
  hypothesis: string;
  status: "draft" | "clarified" | "tested";
  createdAt: string;
}

export interface TradeEvent {
  id: string;
  date: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  grossReturnPct: number;
  netReturnPct: number;
  holdingDays: number;
  isWin: boolean;
}

export interface BacktestMetrics {
  totalSessions: number;
  qualifyingEvents: number;
  meanForwardReturnPct: number;
  medianForwardReturnPct: number;
  winRatePct: number;
  baselineUnconditionalReturnPct: number;
  edgeVsBaselinePct: number;
  bestTradePct: number;
  worstTradePct: number;
  profitFactor: number;
  sharpeRatio: number;
  totalCostBpsDeducted: number;
  trades: TradeEvent[];
  distributionBuckets: { range: string; count: number; isPositive: boolean }[];
  warnings: string[];
}

export interface LearnAnalysis {
  factualSummary: string[];
  cautiousConclusions: string[];
  researchRisks: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    mitigation: string;
  }[];
  nextQuestions: string[];
}

export interface BacktestResult {
  experimentId: string;
  method: "deterministic-historical" | "deterministic-simulated";
  datasetName: string;
  dateRange: { start: string; end: string };
  metrics: BacktestMetrics;
  learn: LearnAnalysis;
  executedAt: string;
}

export interface ResearchState {
  stage: Stage;
  query: string;
  experiment: Experiment | null;
  missingFields: MissingField[];
  assumptions: Assumption[];
  clarificationAnswers: Record<string, string | number>;
  result: BacktestResult | null;
  status: "idle" | "parsing" | "testing" | "error";
  errorMessage: string | null;
  history: { id: string; query: string; timestamp: string }[];
}

export type ResearchAction =
  | { type: "SET_STAGE"; payload: Stage }
  | { type: "SET_QUERY"; payload: string }
  | { type: "START_PARSING" }
  | {
      type: "PARSE_SUCCESS";
      payload: {
        experiment: Experiment;
        missingFields: MissingField[];
        assumptions: Assumption[];
        readyToTest: boolean;
      };
    }
  | { type: "SET_CLARIFICATION_ANSWER"; payload: { key: string; value: string | number } }
  | { type: "APPLY_CLARIFICATIONS" }
  | { type: "UPDATE_EXPERIMENT_FIELD"; payload: Partial<Experiment> }
  | { type: "START_TESTING" }
  | { type: "TEST_SUCCESS"; payload: BacktestResult }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_WORKFLOW" }
  | { type: "LOAD_SAVED_SESSION"; payload: { experiment: Experiment; result?: BacktestResult | null } };
