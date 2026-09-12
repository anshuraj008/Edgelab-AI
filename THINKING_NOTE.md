# Thinking Note: AI Trading Research Assistant

**Candidate Submission** | **Role:** Quantitative Product / AI Full-Stack Engineer  
**Core Framework:** `Ask -> Clarify -> Define -> Test -> Learn`

---

## 1. Problem Framing & Ambiguity Deconstruction

When a trader asks, *"Does buying NIFTY after a sharp fall work?"*, the question cannot be directly backtested because natural language is inherently ambiguous. Key ambiguities include:

1. **"Sharp Fall"**: Does this mean a single-day drop of $-1.0\%$, $-2.0\%$, a 3-day cumulative pullback, an intraday plunge from high, or a statistical standard deviation move ($\le -2\sigma$)?
2. **"Buying"**: Does entry execute at the same-day closing price (which introduces look-ahead bias), at the subsequent market open, or via a limit order?
3. **"Work"**: Over what horizon? A 1-day scalp, a 5-day swing, or until a technical indicator signals exit? Is success defined by gross win rate, Sharpe ratio, or conditional excess return over unconditional market drift?
4. **"Friction"**: Does the strategy survive transaction fees, exchange turnover taxes, and real-world bid-ask slippage during panic selloffs?

### Design Philosophy
The system does not act as an oracle or trade recommendation engine. Instead, it acts as a **Research Assistant** that transforms qualitative natural language into a transparent, testable, and auditable quantitative experiment.

---

## 2. Taxonomy: Known vs. Assumed vs. Clarified vs. Derived

To guarantee full research provenance, every parameter in EdgeLab AI is tracked with its origin:

| Parameter | Example Value | Category | Provenance Rationale |
| :--- | :--- | :--- | :--- |
| **Instrument** | `NIFTY 50` | **User Stated** | Explicitly identified in the prompt. |
| **Timeframe** | `Daily` | **Derived** | Standard resolution inferred for swing research questions. |
| **Entry Trigger** | `Daily Return <= -1.0%` | **Clarified / Assumed** | Vague "sharp fall" translated into a quantitative threshold; confirmed by user. |
| **Holding Horizon** | `5 Trading Sessions` | **Clarified** | User selected or confirmed time-exit window. |
| **Execution Timing** | `Next Session Open` | **Derived / Guardrail** | Enforced by the system to eliminate look-ahead bias. |
| **Test Period** | `2015-01-01 to 2024-12-31` | **Assumed / Clarified** | 10-year window covering multiple market regimes (bull, bear, volatile). |
| **Friction** | `10 bps fee + 5 bps slippage` | **Assumed (Conservative)** | Institutional standard round-trip friction. |

---

## 3. Minimum Necessary Clarifications (P0 vs P1 vs P2)

Rather than overwhelming the user with a 10-question questionnaire, the assistant prioritizes only what materially changes whether the experiment is meaningful:

- **P0 (Critical Blockers):**
  1. *Numeric threshold for the drop* (e.g. $-1.0\%$ vs $-2.0\%$).
  2. *Holding period / Exit rule* (e.g. 5 days).
- **P1 (Execution & Scope):**
  3. *Historical test window* (e.g. 10 years across regimes).
  4. *Friction & slippage* (15 bps default).
- **P2 (Optional Refinement):**
  5. *Volatility regime filters* (e.g. India VIX $> 20$).

---

## 4. What Can Go Wrong: Research Risks & Guardrails

Quantitative research is susceptible to cognitive biases and statistical traps. EdgeLab AI explicitly addresses these pitfalls:

### 1. Look-Ahead Bias
* **The Risk:** Calculating signals using Day $T$'s close and assuming execution at that exact same close price.
* **Mitigation:** Entry is strictly executed at Day $T+1$'s Open price.

### 2. Transaction Costs & Slippage
* **The Risk:** A high win-rate strategy with small average gains ($+0.25\%$) becomes net negative once exchange fees (STT, GST, brokerage) and bid-ask slippage are applied.
* **Mitigation:** All metrics are reported net of explicit, editable cost deductions (15 bps default).

### 3. Small Sample & Clustering Risk
* **The Risk:** Rare drop events (e.g. $-2.5\%$) may only trigger 15 times in 10 years, heavily clustered during crisis periods (e.g., March 2020), skewing statistical independence.
* **Mitigation:** The system flags any test with $N < 30$ events with prominent warnings and provides return distribution histograms.

### 4. Overfitting & Data Snooping (Multiple Comparisons)
* **The Risk:** Cherry-picking $-1.3\%$ because it yielded the highest Sharpe on past data.
* **Mitigation:** The Learn layer recommends out-of-sample testing and sweeps across neighbouring parameter sets without cherry-picking.

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

> **Conclusion:** By restricting the LLM to language structuring and utilizing deterministic TypeScript code for all statistical calculations, EdgeLab AI delivers an auditable, reproducible, and robust quantitative research workbench.
