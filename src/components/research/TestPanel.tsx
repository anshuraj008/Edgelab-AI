import React, { useState } from "react";
import { Experiment } from "@/types/research";
import { PlayCircle, CheckCircle2, ShieldCheck, Loader2, Sliders } from "lucide-react";

interface TestPanelProps {
  experiment: Experiment;
  onRunTest: (datasetSource: "nifty-historical" | "simulated-market") => void;
  isLoading: boolean;
}

export const TestPanel: React.FC<TestPanelProps> = ({
  experiment,
  onRunTest,
  isLoading,
}) => {
  const [datasetSource, setDatasetSource] = useState<"nifty-historical" | "simulated-market">(
    "nifty-historical"
  );

  return (
    <div className="bg-midnight-800 border border-midnight-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-midnight-600 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-violet-accent/15 border border-violet-accent/30 text-violet-hover shadow-violet-sm">
            <PlayCircle className="w-5 h-5 text-violet-hover" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-textPrimary">
              Deterministic Sample Backtest Engine
            </h3>
            <p className="text-xs text-slate-textSecondary">
              Run quantitative backtest across calibrated sample price series with transparent execution rules and explicit costs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-status-success bg-status-success/15 px-3 py-1.5 rounded-full border border-status-success/30 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>Auditable Calculation Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Dataset Choice Card */}
        <div className="md:col-span-2 space-y-3.5">
          <label className="text-[11px] font-bold text-slate-textMuted uppercase tracking-wider block">
            Select Evaluation Dataset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setDatasetSource("nifty-historical")}
              className={`p-4 rounded-xl border text-left transition-all ${
                datasetSource === "nifty-historical"
                  ? "bg-midnight-750 border-violet-accent ring-1 ring-violet-accent shadow-violet-sm"
                  : "bg-midnight-750/70 border-midnight-600 hover:border-midnight-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-textPrimary">
                  Bundled Calibrated Sample Dataset
                </span>
                {datasetSource === "nifty-historical" && (
                  <CheckCircle2 className="w-4 h-4 text-violet-hover" />
                )}
              </div>
              <p className="text-[11px] text-slate-textSecondary">
                Calibrated daily OHLCV series spanning 2015–2024 (~2,450 sessions) across bull, bear, and recovery market regimes.
              </p>
              <span className="mt-2.5 inline-block text-[10px] bg-violet-soft text-violet-hover border border-violet-accent/30 px-2.5 py-0.5 rounded font-mono">
                Calibrated Sample (Prototype)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDatasetSource("simulated-market")}
              className={`p-4 rounded-xl border text-left transition-all ${
                datasetSource === "simulated-market"
                  ? "bg-midnight-750 border-violet-accent ring-1 ring-violet-accent shadow-violet-sm"
                  : "bg-midnight-750/70 border-midnight-600 hover:border-midnight-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-textPrimary">
                  Stress Simulation Series
                </span>
                {datasetSource === "simulated-market" && (
                  <CheckCircle2 className="w-4 h-4 text-violet-hover" />
                )}
              </div>
              <p className="text-[11px] text-slate-textSecondary">
                Deterministic stress-tested simulated market with elevated jump risk and volatility clustering.
              </p>
              <span className="mt-2.5 inline-block text-[10px] bg-status-warning/15 text-status-warning border border-status-warning/30 px-2.5 py-0.5 rounded font-mono">
                Stress Simulation
              </span>
            </button>
          </div>
        </div>

        {/* Execution Rules Summary */}
        <div className="bg-midnight-750/90 border border-midnight-600 rounded-xl p-4 md:p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-textPrimary uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-violet-hover" />
            <span>Execution Semantics</span>
          </div>

          <ul className="text-xs space-y-2 text-slate-textSecondary">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-hover" />
              <span>
                <strong className="text-slate-textPrimary">Entry:</strong> Next session Open price
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-hover" />
              <span>
                <strong className="text-slate-textPrimary">Exit:</strong> Close price on session +{experiment.holdingPeriodDays.value}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-hover" />
              <span>
                <strong className="text-slate-textPrimary">Friction:</strong> -{(
                  (experiment.costs.value.transactionBps +
                    experiment.costs.value.slippageBps) /
                  100
                ).toFixed(2)}% net deduction
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-hover" />
              <span>
                <strong className="text-slate-textPrimary">Overlap:</strong> Non-overlapping windows
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-end pt-5 border-t border-midnight-600">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onRunTest(datasetSource)}
          className="flex items-center gap-2.5 px-6 py-3 bg-violet-accent hover:bg-violet-hover disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-violet-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Computing Deterministic Metrics...</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 text-white" />
              <span>Run Sample Backtest</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
