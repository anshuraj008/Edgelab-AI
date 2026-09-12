/**
 * Statistical and financial metrics calculation utilities for deterministic backtesting
 */

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
  }
  return Math.round(sorted[mid] * 100) / 100;
}

export function calculateStandardDeviation(values: number[], mean?: number): number {
  if (values.length < 2) return 0;
  const m = mean !== undefined ? mean : calculateMean(values);
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function calculateSharpeRatio(returns: number[], riskFreeRateDaily: number = 0.02 / 252): number {
  if (returns.length < 2) return 0;
  const mean = calculateMean(returns) / 100; // to decimal
  const std = calculateStandardDeviation(returns) / 100; // to decimal
  if (std === 0) return 0;
  const annualizedSharpe = ((mean - riskFreeRateDaily) / std) * Math.sqrt(252);
  return Math.round(annualizedSharpe * 100) / 100;
}

export function calculateDistributionBuckets(
  returns: number[],
  numBuckets: number = 7
): { range: string; count: number; isPositive: boolean }[] {
  if (returns.length === 0) return [];

  const min = Math.min(...returns);
  const max = Math.max(...returns);

  // Default clean fixed buckets if returns are within typical range
  const fixedRanges = [
    { label: "< -3%", min: -Infinity, max: -3, isPositive: false },
    { label: "-3% to -1.5%", min: -3, max: -1.5, isPositive: false },
    { label: "-1.5% to 0%", min: -1.5, max: 0, isPositive: false },
    { label: "0% to +1.5%", min: 0, max: 1.5, isPositive: true },
    { label: "+1.5% to +3%", min: 1.5, max: 3, isPositive: true },
    { label: "+3% to +5%", min: 3, max: 5, isPositive: true },
    { label: "> +5%", min: 5, max: Infinity, isPositive: true },
  ];

  return fixedRanges.map((range) => {
    const count = returns.filter((r) => r >= range.min && r < range.max).length;
    return {
      range: range.label,
      count,
      isPositive: range.isPositive,
    };
  });
}
