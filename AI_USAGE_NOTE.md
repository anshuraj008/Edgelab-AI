# AI Usage Note: AI Trading Research Assistant

**Candidate Submission** | **Scope:** 1 Page AI Disclosure & Engineering Philosophy

---

## 1. AI Tools Utilized
* **Google Gemini (Gemini 2.5 Flash / Advanced):** Used during the conceptual design phase for prompt boundary engineering, Zod schema alternatives, and structuring the 5-stage research workflow.
* **Antigravity / Coding Assistant:** Used as a pair-programming partner for component boilerplate scaffolding, TypeScript interface typing, and CSS token refinement.

---

## 2. What AI Was Used For
1. **Prompt Template Engineering:** Refining system prompts to strictly output JSON schema without markdown wrapping or conversational filler.
2. **Schema & Edge-Case Exploration:** Exploring various financial parameter schemas to handle daily vs. hourly intervals and time-based vs. indicator-based exits.
3. **Copy Review & Polish:** Ensuring all UI copy adheres to institutional quantitative finance terminology (e.g., *conditional edge over baseline*, *unconditional drift*, *round-trip friction*).

---

## 3. Decisions Made Personally (Human Engineering Ownership)
* **Architecture & State Machine:** Designed the single-reducer (`useReducer`) workflow architecture in `ResearchWorkbench.tsx` to eliminate re-rendering bugs and maintain clean state boundaries.
* **Provenance Model:** Defined the 4-tier provenance taxonomy (`user`, `assumption`, `clarified`, `derived`) and made it visually distinct and editable.
* **Strict Separation of Compute:** Architected the system such that the LLM is strictly prohibited from computing backtest metrics. All mathematical and return calculations are executed by deterministic TypeScript functions.
* **Clarification Priority Logic:** Designed the deterministic clarification merge layer (`clarification-merger.ts`) ensuring AI cannot overwrite user-confirmed values.
* **Friction & Bias Guardrails:** Enforced mandatory next-session open execution to eliminate look-ahead bias and added explicit 15 bps default friction.

---

## 4. AI Suggestions Explicitly Rejected
* **Rejected:** *Adding a heavy multi-agent framework (e.g., LangChain / AutoGen / CrewAI).*  
  *Rationale:* Adds massive dependencies, opacity, and debugging overhead without improving research transparency. A single structured-output LLM call with deterministic validation is cleaner, faster, and more auditable.
* **Rejected:** *Live Brokerage / Exchange Scraping Integration (Zerodha/Upstox).*  
  *Rationale:* Out of scope for a research assistant; creates API rate limit fragility, authentication hurdles, and licensing issues.
* **Rejected:** *Complex User Auth & Subscription Tiers.*  
  *Rationale:* Focuses on core research experience and product reasoning rather than administrative boilerplate.

---

## 5. What I Am Most Proud Of
* **Transparent Ambiguity Handling:** Transforming vague statements into explicit, editable parameters with visible assumptions.
* **Evidence vs. Interpretation Split:** Presenting factual backtest numbers separately from bounded, non-dogmatic conclusions that explicitly warn against overfitting and sample size limitations.
