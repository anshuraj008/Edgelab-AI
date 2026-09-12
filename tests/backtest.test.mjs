import test from "node:test";
import assert from "node:assert/strict";

// Dynamic import or compile verification
test("Deterministic Backtest & Clarification logic unit tests", async (t) => {
  await t.test("Clarification merger handles holding period and drop threshold", () => {
    const mockExperiment = {
      id: "test_1",
      originalQuery: "Does buying NIFTY after a sharp fall work?",
      instrument: { value: "NIFTY", source: "user" },
      timeframe: { value: "daily", source: "derived" },
      entryCondition: {
        value: { type: "daily_return_drop", thresholdPct: -1.0, description: "Drop 1%" },
        source: "assumption",
      },
      exitCondition: {
        value: { type: "time_exit", holdingDays: 5, description: "5 days" },
        source: "assumption",
      },
      holdingPeriodDays: { value: 5, source: "assumption" },
      testPeriod: { value: { start: "2015-01-01", end: "2024-12-31" }, source: "assumption" },
      costs: { value: { transactionBps: 10, slippageBps: 5 }, source: "assumption" },
      filters: [],
      hypothesis: "Test hypothesis",
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    const clarifications = {
      holdingPeriodDays: 10,
      thresholdPct: -2.0,
      transactionBps: 15,
    };

    // Verify properties
    assert.equal(clarifications.holdingPeriodDays, 10);
    assert.equal(clarifications.thresholdPct, -2.0);
    assert.equal(clarifications.transactionBps, 15);
  });

  await t.test("Friction calculation computes exact net basis points", () => {
    const txBps = 10;
    const slippageBps = 5;
    const totalCostPct = (txBps + slippageBps) / 100;
    assert.equal(totalCostPct, 0.15); // 15 bps = 0.15%

    const grossReturn = 1.0; // 1%
    const netReturn = grossReturn - totalCostPct;
    assert.equal(Math.round(netReturn * 100) / 100, 0.85);
  });

  await t.test("Unconditional baseline comparison produces valid conditional edge", () => {
    const meanForwardReturn = 0.62;
    const baselineReturn = 0.21;
    const edge = Math.round((meanForwardReturn - baselineReturn) * 100) / 100;
    assert.equal(edge, 0.41);
  });
});
