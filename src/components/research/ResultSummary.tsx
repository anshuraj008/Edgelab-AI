import React from "react";
import { BacktestResult } from "@/types/research";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Activity,
  AlertCircle,
  Award,
  Hash,
  Scale,
} from "lucide-react";

interface ResultSummaryProps {
  result: BacktestResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const { metrics, datasetName, dateRange } = result;

  return (
    <div className="bg-midnight-800 border border-midnight-600 rounded-xl p-6 md:p-8 shadow-card transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-midnight-600 pb-5 gap-2">
        <div>
          <span className="text-[10px] font-bold text-violet-hover uppercase tracking-wider block mb-1">
            Deterministic Test Output
          </span>
          <h3 className="text-base font-bold text-slate-textPrimary">
            Sample Test Evidence ({datasetName})
          </h3>
          <p className="text-xs text-slate-textSecondary">
            Evaluation Window: {dateRange.start} &rarr; {dateRange.end} ({metrics.totalSessions} daily sessions evaluated)
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] bg-midnight-750 text-slate-textSecondary border border-midnight-600 px-3 py-1.5 rounded-lg font-mono">
            Friction Deducted: {metrics.totalCostBpsDeducted} bps
          </span>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Events Count */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-textMuted" />
            <span>Sample Events</span>
          </div>
          <div className="text-xl font-bold text-slate-textPrimary font-mono">
            {metrics.qualifyingEvents}
          </div>
          <span className="text-[10px] text-slate-textMuted">Qualifying triggers</span>
        </div>

        {/* Win Rate */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <Percent className="w-3.5 h-3.5 text-status-success" />
            <span>Win Rate</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.winRatePct >= 50 ? "text-status-success" : "text-status-warning"
            }`}
          >
            {metrics.winRatePct}%
          </div>
          <span className="text-[10px] text-slate-textMuted">Net profitable trades</span>
        </div>

        {/* Mean Net Forward Return */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-violet-hover" />
            <span>Mean Return</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.meanForwardReturnPct >= 0 ? "text-violet-hover" : "text-status-error"
            }`}
          >
            {metrics.meanForwardReturnPct > 0 ? "+" : ""}
            {metrics.meanForwardReturnPct}%
          </div>
          <span className="text-[10px] text-slate-textMuted">
            Median: {metrics.medianForwardReturnPct > 0 ? "+" : ""}
            {metrics.medianForwardReturnPct}%
          </span>
        </div>

        {/* Baseline Return */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-textMuted" />
            <span>Unconditional Baseline</span>
          </div>
          <div className="text-xl font-bold text-slate-textPrimary font-mono">
            {metrics.baselineUnconditionalReturnPct > 0 ? "+" : ""}
            {metrics.baselineUnconditionalReturnPct}%
          </div>
          <span className="text-[10px] text-slate-textMuted">All-session drift</span>
        </div>

        {/* Edge vs Baseline */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <Award className="w-3.5 h-3.5 text-violet-hover" />
            <span>Conditional Edge</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.edgeVsBaselinePct >= 0 ? "text-status-success" : "text-status-warning"
            }`}
          >
            {metrics.edgeVsBaselinePct > 0 ? "+" : ""}
            {metrics.edgeVsBaselinePct}%
          </div>
          <span className="text-[10px] text-slate-textMuted">Excess over baseline</span>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-midnight-750/90 border border-midnight-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-textMuted mb-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-textMuted" />
            <span>Sharpe Ratio</span>
          </div>
          <div className="text-xl font-bold text-slate-textPrimary font-mono">
            {metrics.sharpeRatio}
          </div>
          <span className="text-[10px] text-slate-textMuted">
            Profit Factor: {metrics.profitFactor}
          </span>
        </div>
      </div>

      {/* Distribution Chart & Tail Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 bg-midnight-750/80 border border-midnight-600 p-5 rounded-xl">
          <h4 className="text-[11px] font-bold text-slate-textMuted uppercase tracking-wider mb-4">
            Forward Return Distribution (Net of Costs)
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.distributionBuckets}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#737D96" }} stroke="#232D48" />
                <YAxis tick={{ fontSize: 10, fill: "#737D96" }} stroke="#232D48" />
                <Tooltip
                  formatter={(value: any) => [`${value} trades`, "Frequency"]}
                  contentStyle={{
                    backgroundColor: "#11182E",
                    borderRadius: "8px",
                    borderColor: "#232D48",
                    color: "#F8F9FC",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#F8F9FC" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {metrics.distributionBuckets.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isPositive ? "#7E3BED" : "#F4B740"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worst / Best Tail Risk Card */}
        <div className="bg-midnight-750/80 border border-midnight-600 p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-[11px] font-bold text-slate-textMuted uppercase tracking-wider mb-3">
              Distribution Tail Risk
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg border border-midnight-600">
                <span className="text-slate-textSecondary flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                  <span>Best Trade:</span>
                </span>
                <span className="font-bold text-status-success font-mono">
                  +{metrics.bestTradePct}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg border border-midnight-600">
                <span className="text-slate-textSecondary flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-status-error" />
                  <span>Worst Trade:</span>
                </span>
                <span className="font-bold text-status-error font-mono">
                  {metrics.worstTradePct}%
                </span>
              </div>
            </div>
          </div>

          {/* Warnings Box */}
          {metrics.warnings.length > 0 && (
            <div className="p-3 bg-status-warning/10 border border-status-warning/25 rounded-xl text-[11px] text-status-warning space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-status-warning shrink-0" />
                <span>Evidence Caveats</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-textSecondary">
                {metrics.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
