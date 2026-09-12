import { Experiment, BacktestResult, TradeEvent, BacktestMetrics, LearnAnalysis } from "@/types/research";
import { getPriceSeries, DailyCandle } from "./dataset";
import {
  calculateMean,
  calculateMedian,
  calculateSharpeRatio,
  calculateDistributionBuckets,
} from "./metrics";

export interface RunBacktestOptions {
  experiment: Experiment;
  allowOverlap?: boolean;
}

export function runDeterministicBacktest(options: RunBacktestOptions): BacktestResult {
  const { experiment, allowOverlap = false } = options;

  const startDate = experiment.testPeriod?.value?.start || "2015-01-01";
  const endDate = experiment.testPeriod?.value?.end || "2024-12-31";
  const holdingDays = experiment.holdingPeriodDays?.value || 5;
  const thresholdPct = experiment.entryCondition?.value?.thresholdPct ?? -1.0;
  const transactionBps = experiment.costs?.value?.transactionBps ?? 10;
  const slippageBps = experiment.costs?.value?.slippageBps ?? 5;
  const totalCostPct = (transactionBps + slippageBps) / 100; // e.g. 15 bps = 0.15%

  const series: DailyCandle[] = getPriceSeries(
    experiment.instrument?.value || "NIFTY",
    startDate,
    endDate
  );

  const trades: TradeEvent[] = [];
  const allForwardReturns: number[] = [];
  let nextAvailableIndex = 0;

  for (let i = 1; i < series.length - holdingDays; i++) {
    const candle = series[i];

    // Compute unconditional baseline N-day forward returns for all sessions
    const baselineExitPrice = series[i + holdingDays].close;
    const baselineGross = ((baselineExitPrice - candle.close) / candle.close) * 100;
    allForwardReturns.push(baselineGross);

    // Check entry condition (e.g. sharp drop <= thresholdPct)
    if (candle.dailyReturnPct <= thresholdPct) {
      if (!allowOverlap && i < nextAvailableIndex) {
        continue; // skip overlapping trade window
      }

      // Entry on next session open (Day T+1 Open)
      const entryCandle = series[i + 1] || candle;
      const entryPrice = entryCandle.open || candle.close;

      // Exit on Day T + holdingDays Close (e.g. 5th session close)
      const exitIndex = Math.min(i + holdingDays, series.length - 1);
      const exitCandle = series[exitIndex];
      const exitPrice = exitCandle.close;

      const grossReturnPct = ((exitPrice - entryPrice) / entryPrice) * 100;
      const netReturnPct = Math.round((grossReturnPct - totalCostPct) * 100) / 100;

      trades.push({
        id: `trade_${trades.length + 1}`,
        date: candle.date,
        entryPrice: Math.round(entryPrice * 100) / 100,
        exitDate: exitCandle.date,
        exitPrice: Math.round(exitPrice * 100) / 100,
        grossReturnPct: Math.round(grossReturnPct * 100) / 100,
        netReturnPct,
        holdingDays,
        isWin: netReturnPct > 0,
      });

      nextAvailableIndex = i + holdingDays + 1;
    }
  }

  const netReturns = trades.map((t) => t.netReturnPct);
  const winTrades = trades.filter((t) => t.isWin);
  const lossTrades = trades.filter((t) => !t.isWin);

  const totalGrossWin = winTrades.reduce((sum, t) => sum + t.netReturnPct, 0);
  const totalGrossLoss = Math.abs(lossTrades.reduce((sum, t) => sum + t.netReturnPct, 0));
  const profitFactor =
    totalGrossLoss === 0
      ? totalGrossWin > 0
        ? 99.9
        : 1.0
      : Math.round((totalGrossWin / totalGrossLoss) * 100) / 100;

  const meanForwardReturnPct = calculateMean(netReturns);
  const medianForwardReturnPct = calculateMedian(netReturns);
  const winRatePct =
    trades.length > 0
      ? Math.round((winTrades.length / trades.length) * 1000) / 10
      : 0;

  const baselineUnconditionalReturnPct = calculateMean(allForwardReturns);
  const edgeVsBaselinePct =
    Math.round((meanForwardReturnPct - baselineUnconditionalReturnPct) * 100) / 100;

  const bestTradePct = trades.length > 0 ? Math.max(...netReturns) : 0;
  const worstTradePct = trades.length > 0 ? Math.min(...netReturns) : 0;
  const sharpeRatio = calculateSharpeRatio(netReturns);
  const distributionBuckets = calculateDistributionBuckets(netReturns);

  const warnings: string[] = [];
  if (trades.length < 30) {
    warnings.push(
      `Small sample size (${trades.length} events). Statistical power is limited.`
    );
  }
  warnings.push("Tested on bundled calibrated sample dataset for prototype demonstration.");
  if (totalCostPct > 0) {
    warnings.push(
      `Returns are net of ${transactionBps} bps transaction fees + ${slippageBps} bps slippage (${totalCostPct}% per round-trip).`
    );
  }

  const metrics: BacktestMetrics = {
    totalSessions: series.length,
    qualifyingEvents: trades.length,
    meanForwardReturnPct,
    medianForwardReturnPct,
    winRatePct,
    baselineUnconditionalReturnPct,
    edgeVsBaselinePct,
    bestTradePct,
    worstTradePct,
    profitFactor,
    sharpeRatio,
    totalCostBpsDeducted: transactionBps + slippageBps,
    trades,
    distributionBuckets,
    warnings,
  };

  // Generate structured, factual and cautious Learn Analysis
  const learn: LearnAnalysis = generateDeterministicLearnAnalysis({
    experiment,
    metrics,
    holdingDays,
    thresholdPct,
    startDate,
    endDate,
  });

  return {
    experimentId: experiment.id,
    method: "deterministic-historical",
    datasetName: "Bundled Calibrated Sample Dataset (2015–2024)",
    dateRange: { start: startDate, end: endDate },
    metrics,
    learn,
    executedAt: new Date().toISOString(),
  };
}

function generateDeterministicLearnAnalysis(params: {
  experiment: Experiment;
  metrics: BacktestMetrics;
  holdingDays: number;
  thresholdPct: number;
  startDate: string;
  endDate: string;
}): LearnAnalysis {
  const { experiment, metrics, holdingDays, thresholdPct, startDate, endDate } = params;

  const dropMagnitude = Math.abs(thresholdPct);

  const factualSummary = [
    `Between ${startDate} and ${endDate}, exactly ${metrics.qualifyingEvents} sessions qualified under the rule (daily drop >= ${dropMagnitude}%).`,
    `The average ${holdingDays}-day forward net return was ${metrics.meanForwardReturnPct > 0 ? "+" : ""}${metrics.meanForwardReturnPct}% (median: ${metrics.medianForwardReturnPct > 0 ? "+" : ""}${metrics.medianForwardReturnPct}%).`,
    `The unconditional baseline forward return across all trading sessions was ${metrics.baselineUnconditionalReturnPct > 0 ? "+" : ""}${metrics.baselineUnconditionalReturnPct}%.`,
    `The conditional edge over baseline is ${metrics.edgeVsBaselinePct > 0 ? "+" : ""}${metrics.edgeVsBaselinePct} percentage points with a win rate of ${metrics.winRatePct}%.`,
    `Deducted ${metrics.totalCostBpsDeducted} bps total friction (${experiment.costs?.value?.transactionBps || 10} bps fees + ${experiment.costs?.value?.slippageBps || 5} bps slippage).`,
  ];

  const cautiousConclusions = [
    metrics.edgeVsBaselinePct > 0
      ? `In this sample dataset, buying after a ${dropMagnitude}% drop was associated with a higher average forward return than the unconditional baseline. This does not prove the edge will persist in future market conditions.`
      : `In this sample dataset, the rule did not demonstrate a clear edge over the unconditional baseline after friction.`,
    `Tail risk must be respected: the worst single trade in this sample lost ${metrics.worstTradePct}%, demonstrating that fixed time exits carry downside exposure during sustained selloffs.`,
    `Event frequency (${metrics.qualifyingEvents} trades over ${Math.round(metrics.totalSessions / 252)} years) represents an episodic strategy rather than a daily high-frequency setup.`,
  ];

  const researchRisks = [
    {
      title: "Look-Ahead & Execution Timing",
      description: "Entering at next-session open avoids same-day close look-ahead bias, but real market opens can experience opening gap risk.",
      severity: "medium" as const,
      mitigation: "Compare performance using next-session open execution versus waiting for the next-session close.",
    },
    {
      title: "Sample Size & Regime Clustering",
      description: `With ${metrics.qualifyingEvents} events, qualifying triggers tend to cluster during high-volatility market selloffs rather than distributing evenly.`,
      severity: metrics.qualifyingEvents < 50 ? ("high" as const) : ("medium" as const),
      mitigation: "Evaluate results separately across high-volatility versus low-volatility regimes.",
    },
    {
      title: "Transaction Costs & Slippage",
      description: "Panic selloff days typically experience wider bid-ask spreads and liquidity withdrawal.",
      severity: "medium" as const,
      mitigation: `Configured ${experiment.costs?.value?.slippageBps || 5} bps slippage assumption; re-test with 15–20 bps to verify resilience.`,
    },
    {
      title: "Multiple Hypothesis Testing (Data Snooping)",
      description: "Testing multiple drop thresholds (e.g. 0.5%, 1.0%, 1.5%, 2.0%) until finding a winning result creates false confidence.",
      severity: "high" as const,
      mitigation: "Predefine parameters before testing and validate findings on a holdout out-of-sample period (e.g., 2023–2024).",
    },
  ];

  const nextQuestions = [
    `How does performance change if the drop threshold is changed to 0.5%, 1.5%, or 2.0% without cherry-picking?`,
    `Does adding a market trend filter (e.g., only buying when price is above its 200-day moving average) improve the win rate?`,
    `What happens if a predefined stop-loss (e.g. -2.0%) is added instead of holding strictly for ${holdingDays} days?`,
    `How does this strategy perform when tested on an out-of-sample time window (e.g., 2023–2024)?`,
  ];

  return {
    factualSummary,
    cautiousConclusions,
    researchRisks,
    nextQuestions,
  };
}
