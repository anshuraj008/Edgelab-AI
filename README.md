# EdgeLab AI — AI Trading Research Assistant

> A production-grade Quantitative Research Workbench that transforms ambiguous natural-language market questions into transparent, testable, and auditable experiments.

---

## 1. Project Overview & Research Journey

EdgeLab AI demonstrates a disciplined 5-stage research workflow:

```
[1. ASK]       Accept ambiguous query ("Does buying NIFTY after a sharp fall work?")
   │
   ▼
[2. CLARIFY]   Detect missing parameters & assumptions without silent invention
   │
   ▼
[3. DEFINE]    Generate structured experiment with explicit 4-tier Provenance Badges
   │
   ▼
[4. TEST]      Execute 100% deterministic backtest in TypeScript (No LLM math)
   │
   ▼
[5. LEARN]     Strictly separate "What Data Shows" from "What We Conclude" + Risks
```

---

## 2. Architecture & Design Principles

```
Browser / Client (Next.js App Router UI)
  │
  ├──> POST /api/research/parse ──> Rate Limit ──> Gemini API (Server Key) ──> Zod Validate ──> Structured Draft
  │
  ├──> POST /api/research/test  ──> Rate Limit ──> Deterministic Engine   ──> Historical NIFTY Series ──> Auditable Metrics
  │
  └──> Neon PostgreSQL / Drizzle ORM (Optional Persistent State with Resilient Fallback)
```

### Core Architecture Tenets:
1. **Meaningful AI, Not a Chat Wrapper**: The LLM structures ambiguous language; deterministic TypeScript code computes all calculations and statistics.
2. **Provenance Transparency**: Every parameter is tagged as `User Stated`, `System Assumption`, `Clarified`, or `Derived Context`.
3. **No Look-Ahead Bias**: Entry signals execute at next-session Open.
4. **Frictional Realism**: Net returns deduct 10 bps transaction fees + 5 bps slippage (15 bps total) by default.
5. **Anti-Re-Render State Machine**: Managed through a single `useReducer` in `ResearchWorkbench.tsx`.

---

## 3. Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Full-stack architecture & API route handlers |
| **Language** | TypeScript 5 | Strict end-to-end type safety |
| **Styling** | Tailwind CSS | Cyprus (`#004741`) & warm sand design system |
| **AI / LLM** | Google Gemini API (`gemini-2.5-flash`) | Natural language parsing & structured JSON output |
| **Validation** | Zod | Runtime payload & output schema validation |
| **Database** | Neon PostgreSQL + Drizzle ORM | Serverless persistence with offline in-memory fallback |
| **Visualization** | Recharts & Lucide Icons | Return distribution charts & accessible icons |

---

## 4. Experiment Schema & Provenance Model

```typescript
interface Experiment {
  id: string;
  originalQuery: string;
  instrument: ProvenanceItem<string>;
  timeframe: ProvenanceItem<"daily" | "hourly">;
  entryCondition: ProvenanceItem<{
    type: string;
    thresholdPct: number; // e.g. -1.0%
    description: string;
  }>;
  exitCondition: ProvenanceItem<{
    type: "time_exit" | "stop_or_target";
    holdingDays: number;
    description: string;
  }>;
  holdingPeriodDays: ProvenanceItem<number>;
  testPeriod: ProvenanceItem<{ start: string; end: string }>;
  costs: ProvenanceItem<{ transactionBps: number; slippageBps: number }>;
  filters: FilterCondition[];
  hypothesis: string;
  status: "draft" | "clarified" | "tested";
}
```

---

## 5. Security & Guardrails Checklist

- [x] **No Client-Side Secrets**: `GEMINI_API_KEY` and `DATABASE_URL` remain strictly server-side.
- [x] **Prompt Injection Defense**: User queries treated purely as data strings within fixed system instructions.
- [x] **Strict Output Parsing**: All AI outputs validated via Zod schema with automatic fallback.
- [x] **Rate Limiting**: Sliding window rate-limiting on all route handlers.
- [x] **Zero XSS**: Text rendered as pure React nodes without `dangerouslySetInnerHTML`.
- [x] **No Hallucinated Returns**: Deterministic calculation engine owns all backtest metrics.

---

## 6. Local Setup & Run Instructions

### Prerequisites
- Node.js >= 18.x (tested on v24.12.0)
- npm >= 9.x

### Quick Start
```bash
# 1. Clone repository
git clone <repo-url>
cd edgelab-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env.local
# Add your GEMINI_API_KEY (optional, includes offline fallback parser)
# Add your DATABASE_URL (optional, includes in-memory persistence)

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Verification Commands
```bash
# Run unit tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Build production bundle
npm run build
```

---

## 7. Demo Script & Submission Highlights (2-3 Minutes)

1. **0:00 - 0:30 (Problem & Vision):** Show the initial Ask stage. Explain that qualitative questions like "Does buying NIFTY after a sharp fall work?" are ambiguous and un-testable without structured parameters.
2. **0:30 - 1:00 (Clarify):** Click prompt; show the Clarification screen. Highlight that the AI detected missing drop threshold, holding duration, and test period instead of silently inventing them.
3. **1:00 - 1:40 (Define & Provenance):** Review the 2-column defined experiment. Show the interactive provenance badges (`User Stated`, `Assumption`, `Clarified`, `Derived`) and edit a parameter.
4. **1:40 - 2:20 (Deterministic Test):** Execute the backtest on the calibrated 10-year NIFTY series. Walk through the metric cards (win rate, mean return, unconditional baseline, and conditional edge) and return distribution chart.
5. **2:20 - 3:00 (Learn & Critical Thinking):** Show the clear split between factual evidence and cautious conclusions. Review the acknowledged research risks (look-ahead bias, slippage, clustering, multiple comparisons) and click a next-question hypothesis to iterate.

---

## 8. License

MIT License. Designed for quantitative evaluation.
