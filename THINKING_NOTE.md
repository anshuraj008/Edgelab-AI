# Thinking Note: AI Trading Research Assistant

**Candidate Submission** | **Role:** Quantitative Product / AI Full-Stack Engineer  
**Core Framework:** `Ask -> Clarify -> Define -> Test -> Learn`

---

## 1. Problem Framing & Ambiguity Deconstruction

When a trader asks, *"Does buying NIFTY after a sharp fall work?"*, the question cannot be directly backtested because natural language is inherently ambiguous. Key ambiguities include:

1. **"Sharp Fall"**: Does this mean a single-day drop of $1.0\%$, $1.5\%$, $2.0\%$, a multi-day cumulative pullback, or an intraday plunge from high?
2. **"Buying"**: Does entry execute at the same-day closing price (which introduces look-ahead bias), at the subsequent market open, or via a limit order?
3. **"Work"**: Over what horizon? A 3-day swing, a 5-day hold, or a trend continuation? Is success measured by raw win rate or conditional excess return over unconditional market drift?
4. **"Friction"**: Does the strategy survive realistic transaction costs and execution slippage during panic selloff days?

### Design Philosophy
The system does not act as an oracle or trade recommendation engine. Instead, it acts as a **Research Assistant** that transforms qualitative natural language into a transparent, testable, and auditable quantitative experiment.

---

## 2. Taxonomy: User Stated vs. System Assumption vs. Clarified vs. AI Inferred

To guarantee full research provenance, every parameter in EdgeLab AI is tracked with its origin:

| Parameter | Example Value | Category | Provenance Rationale |
| :--- | :--- | :--- | :--- |
| **Instrument** | `NIFTY 50` | **User Stated** | Explicitly identified in the prompt. |
| **Timeframe** | `Daily` | **AI Inferred** | Standard resolution inferred for swing research questions. |
| **Entry Trigger** | `Daily Return <= -1.0% (1.0% drop)` | **Clarified / Assumption** | Vague "sharp fall" translated into a quantitative threshold; confirmed by user. |
| **Holding Horizon** | `5 Trading Sessions` | **Clarified** | User selected or confirmed time-exit window. |
| **Execution Timing** | `Next Session Open` | **AI Inferred / Guardrail** | Enforced by the system to eliminate look-ahead bias. |
| **Evaluation Window** | `2015-01-01 to 2024-12-31` | **Clarified / Assumption** | 10-year window covering multiple market regimes (bull, bear, volatile). |
| **Friction** | `10 bps fee + 5 bps slippage` | **System Assumption** | Standard institutional round-trip friction estimate. |

---

## 3. Minimum Necessary Clarifications (P0 vs P1 vs P2)

Rather than overwhelming the user with an exhaustive questionnaire, the assistant prioritizes only what materially changes whether the experiment is meaningful:

- **P0 (Critical Blockers):**
  1. *Numeric threshold for the drop* (e.g. $1.0\%$ vs $1.5\%$ vs $2.0\%$ drop).
  2. *Holding period / Exit rule* (e.g. 3, 5, or 10 sessions).
- **P1 (Execution & Scope):**
  3. *Historical test window* (e.g. 10 years across regimes).
  4. *Friction & slippage* (15 bps default).
- **P2 (Optional Refinement):**
  5. *Volatility or trend filters* (e.g. 200-day moving average trend filter).

---

## 4. What Can Go Wrong: Research Risks & Guardrails

Quantitative research is susceptible to cognitive biases and statistical traps. EdgeLab AI explicitly addresses these pitfalls:

### 1. Look-Ahead Bias
* **The Risk:** Calculating signals using Day $T$'s close and assuming execution at that exact same close price.
* **Mitigation:** Entry is strictly executed at Day $T+1$'s Open price.

### 2. Transaction Costs & Slippage
* **The Risk:** A high win-rate strategy with small average gains ($+0.25\%$) becomes net negative once exchange fees (brokerage, taxes) and bid-ask slippage are applied.
* **Mitigation:** All metrics are reported net of explicit, editable cost deductions (15 bps default).

### 3. Small Sample & Clustering Risk
* **The Risk:** Rare drop events (e.g. $\ge 2.0\%$ drops) may only trigger 30–50 times in 10 years, heavily clustered during crisis periods (e.g. March 2020), skewing statistical independence.
* **Mitigation:** The system flags any test with $N < 30$ events with prominent warnings and provides return distribution histograms.

### 4. Overfitting & Data Snooping (Multiple Comparisons)
* **The Risk:** Testing multiple drop thresholds ($0.5\%, 1.0\%, 1.5\%, 2.0\%$) until finding a winning result creates false confidence.
* **Mitigation:** Predefine parameters before testing and validate findings on a holdout out-of-sample period (e.g., 2023–2024).

---

## 5. Architectural Split: AI vs. Deterministic Code

| Responsibility | AI (Google Gemini) | Deterministic Code (TypeScript) |
| :--- | :---: | :---: |
| Language & Intent Parsing | **Yes** | No |
| Ambiguity & Missing Field Detection | **Yes** | No |
| Conservative Assumption Proposals | **Yes** | No |
| Input Validation & Schema Enforcement | No | **Yes (Zod)** |
| Clarification State Merging | No | **Yes** |
| Backtest Return Calculations | **NEVER** | **Yes (100% Deterministic)** |
| Benchmark Baseline Comparison | **NEVER** | **Yes** |
| Evidence / Conclusion Separation | Structured Copy | **Enforced by Schema** |

> **Conclusion:** By restricting the LLM to language structuring and utilizing deterministic TypeScript code for all statistical calculations over a calibrated sample dataset, EdgeLab AI delivers an auditable, reproducible, and robust quantitative research workbench.
