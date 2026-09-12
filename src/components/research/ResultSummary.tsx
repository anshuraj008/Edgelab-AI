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
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-xl p-6 md:p-8 shadow-card transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-600 pb-5 gap-2">
        <div>
          <span className="text-[10px] font-bold text-madder-400 uppercase tracking-wider block mb-1">
            Deterministic Test Output
          </span>
          <h3 className="text-base font-bold text-snow-100">
            Sample Test Evidence ({datasetName})
          </h3>
          <p className="text-xs text-snow-400">
            Evaluation Window: {dateRange.start} &rarr; {dateRange.end} ({metrics.totalSessions} daily sessions evaluated)
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] bg-obsidian-750 text-snow-400 border border-obsidian-600 px-3 py-1.5 rounded-lg font-mono">
            Friction Deducted: {metrics.totalCostBpsDeducted} bps
          </span>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Events Count */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
            <Hash className="w-3.5 h-3.5 text-snow-500" />
            <span>Sample Events</span>
          </div>
          <div className="text-xl font-bold text-snow-100 font-mono">
            {metrics.qualifyingEvents}
          </div>
          <span className="text-[10px] text-snow-500">Qualifying triggers</span>
        </div>

        {/* Win Rate */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
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
          <span className="text-[10px] text-snow-500">Net profitable trades</span>
        </div>

        {/* Mean Net Forward Return */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-madder-400" />
            <span>Mean Return</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.meanForwardReturnPct >= 0 ? "text-madder-400" : "text-status-error"
            }`}
          >
            {metrics.meanForwardReturnPct > 0 ? "+" : ""}
            {metrics.meanForwardReturnPct}%
          </div>
          <span className="text-[10px] text-snow-500">
            Median: {metrics.medianForwardReturnPct > 0 ? "+" : ""}
            {metrics.medianForwardReturnPct}%
          </span>
        </div>

        {/* Baseline Return */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
            <Scale className="w-3.5 h-3.5 text-snow-500" />
            <span>Unconditional Baseline</span>
          </div>
          <div className="text-xl font-bold text-snow-100 font-mono">
            {metrics.baselineUnconditionalReturnPct > 0 ? "+" : ""}
            {metrics.baselineUnconditionalReturnPct}%
          </div>
          <span className="text-[10px] text-snow-500">All-session drift</span>
        </div>

        {/* Edge vs Baseline */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
            <Award className="w-3.5 h-3.5 text-madder-400" />
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
          <span className="text-[10px] text-snow-500">Excess over baseline</span>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-snow-500 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-snow-500" />
            <span>Sharpe Ratio</span>
          </div>
          <div className="text-xl font-bold text-snow-100 font-mono">
            {metrics.sharpeRatio}
          </div>
          <span className="text-[10px] text-snow-500">
            Profit Factor: {metrics.profitFactor}
          </span>
        </div>
      </div>

      {/* Distribution Chart & Tail Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 bg-obsidian-750/80 border border-obsidian-600 p-5 rounded-xl">
          <h4 className="text-[11px] font-bold text-snow-500 uppercase tracking-wider mb-4">
            Forward Return Distribution (Net of Costs)
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.distributionBuckets}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#8E8087" }} stroke="#3A2B33" />
                <YAxis tick={{ fontSize: 10, fill: "#8E8087" }} stroke="#3A2B33" />
                <Tooltip
                  formatter={(value: any) => [`${value} trades`, "Frequency"]}
                  contentStyle={{
                    backgroundColor: "#181316",
                    borderRadius: "8px",
                    borderColor: "#3A2B33",
                    color: "#FCF8F9",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#FCF8F9" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {metrics.distributionBuckets.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isPositive ? "#A21721" : "#F4B740"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worst / Best Tail Risk Card */}
        <div className="bg-obsidian-750/80 border border-obsidian-600 p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-[11px] font-bold text-snow-500 uppercase tracking-wider mb-3">
              Distribution Tail Risk
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-obsidian-800 rounded-lg border border-obsidian-600">
                <span className="text-snow-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                  <span>Best Trade:</span>
                </span>
                <span className="font-bold text-status-success font-mono">
                  +{metrics.bestTradePct}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-obsidian-800 rounded-lg border border-obsidian-600">
                <span className="text-snow-400 flex items-center gap-1.5">
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
              <ul className="list-disc pl-4 space-y-0.5 text-snow-400">
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
