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
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand-200 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-bold text-cyprus-800 uppercase tracking-wider block">
            Deterministic Test Output
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            Sample Test Evidence ({datasetName})
          </h3>
          <p className="text-xs text-slate-500">
            Evaluation Window: {dateRange.start} &rarr; {dateRange.end} ({metrics.totalSessions} daily sessions evaluated)
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] bg-sand-200 text-slate-700 px-2.5 py-1 rounded-md font-mono">
            Friction Deducted: {metrics.totalCostBpsDeducted} bps
          </span>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Events Count */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Events</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {metrics.qualifyingEvents}
          </div>
          <span className="text-[10px] text-slate-500">Qualifying triggers</span>
        </div>

        {/* Win Rate */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
            <span>Win Rate</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.winRatePct >= 50 ? "text-emerald-700" : "text-amber-800"
            }`}
          >
            {metrics.winRatePct}%
          </div>
          <span className="text-[10px] text-slate-500">Net profitable trades</span>
        </div>

        {/* Mean Net Forward Return */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyprus-700" />
            <span>Mean Return</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.meanForwardReturnPct >= 0 ? "text-cyprus-800" : "text-brick-700"
            }`}
          >
            {metrics.meanForwardReturnPct > 0 ? "+" : ""}
            {metrics.meanForwardReturnPct}%
          </div>
          <span className="text-[10px] text-slate-500">
            Median: {metrics.medianForwardReturnPct > 0 ? "+" : ""}
            {metrics.medianForwardReturnPct}%
          </span>
        </div>

        {/* Baseline Return */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>Unconditional Baseline</span>
          </div>
          <div className="text-xl font-bold text-slate-700 font-mono">
            {metrics.baselineUnconditionalReturnPct > 0 ? "+" : ""}
            {metrics.baselineUnconditionalReturnPct}%
          </div>
          <span className="text-[10px] text-slate-500">All-session drift</span>
        </div>

        {/* Edge vs Baseline */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Award className="w-3.5 h-3.5 text-cyprus-700" />
            <span>Conditional Edge</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.edgeVsBaselinePct >= 0 ? "text-emerald-700" : "text-amber-800"
            }`}
          >
            {metrics.edgeVsBaselinePct > 0 ? "+" : ""}
            {metrics.edgeVsBaselinePct}%
          </div>
          <span className="text-[10px] text-slate-500">Excess over baseline</span>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-sand-50/90 border border-sand-200 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Sharpe Ratio</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {metrics.sharpeRatio}
          </div>
          <span className="text-[10px] text-slate-500">
            Profit Factor: {metrics.profitFactor}
          </span>
        </div>
      </div>

      {/* Distribution Chart & Tail Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 bg-sand-50/60 border border-sand-200 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Forward Return Distribution (Net of Costs)
          </h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.distributionBuckets}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} trades`, "Frequency"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    borderColor: "#E5E0D8",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {metrics.distributionBuckets.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isPositive ? "#006454" : "#B45309"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worst / Best Tail Risk Card */}
        <div className="bg-sand-50/60 border border-sand-200 p-4 rounded-lg flex flex-col justify-between space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Distribution Tail Risk
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-sand-200">
                <span className="text-slate-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Best Trade:</span>
                </span>
                <span className="font-bold text-emerald-700 font-mono">
                  +{metrics.bestTradePct}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-sand-200">
                <span className="text-slate-600 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-brick-600" />
                  <span>Worst Trade:</span>
                </span>
                <span className="font-bold text-brick-700 font-mono">
                  {metrics.worstTradePct}%
                </span>
              </div>
            </div>
          </div>

          {/* Warnings Box */}
          {metrics.warnings.length > 0 && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Evidence Caveats</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
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
