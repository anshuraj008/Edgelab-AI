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
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-obsidian-600 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-madder-700/15 border border-madder-700/30 text-madder-400 shadow-madder-sm">
            <PlayCircle className="w-5 h-5 text-madder-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-snow-100">
              Deterministic Sample Backtest Engine
            </h3>
            <p className="text-xs text-snow-400">
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
          <label className="text-[11px] font-bold text-snow-500 uppercase tracking-wider block">
            Select Evaluation Dataset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setDatasetSource("nifty-historical")}
              className={`p-4 rounded-xl border text-left transition-all ${
                datasetSource === "nifty-historical"
                  ? "bg-obsidian-750 border-madder-600 ring-1 ring-madder-600 shadow-madder-sm"
                  : "bg-obsidian-750/70 border-obsidian-600 hover:border-obsidian-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-snow-100">
                  Bundled Calibrated Sample Dataset
                </span>
                {datasetSource === "nifty-historical" && (
                  <CheckCircle2 className="w-4 h-4 text-madder-400" />
                )}
              </div>
              <p className="text-[11px] text-snow-400">
                Calibrated daily OHLCV series spanning 2015–2024 (~2,450 sessions) across bull, bear, and recovery market regimes.
              </p>
              <span className="mt-2.5 inline-block text-[10px] bg-madder-700/15 text-madder-300 border border-madder-700/30 px-2.5 py-0.5 rounded font-mono">
                Calibrated Sample (Prototype)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDatasetSource("simulated-market")}
              className={`p-4 rounded-xl border text-left transition-all ${
                datasetSource === "simulated-market"
                  ? "bg-obsidian-750 border-madder-600 ring-1 ring-madder-600 shadow-madder-sm"
                  : "bg-obsidian-750/70 border-obsidian-600 hover:border-obsidian-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-snow-100">
                  Stress Simulation Series
                </span>
                {datasetSource === "simulated-market" && (
                  <CheckCircle2 className="w-4 h-4 text-madder-400" />
                )}
              </div>
              <p className="text-[11px] text-snow-400">
                Deterministic stress-tested simulated market with elevated jump risk and volatility clustering.
              </p>
              <span className="mt-2.5 inline-block text-[10px] bg-status-warning/15 text-status-warning border border-status-warning/30 px-2.5 py-0.5 rounded font-mono">
                Stress Simulation
              </span>
            </button>
          </div>
        </div>

        {/* Execution Rules Summary */}
        <div className="bg-obsidian-750/90 border border-obsidian-600 rounded-xl p-4 md:p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-snow-100 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-madder-400" />
            <span>Execution Semantics</span>
          </div>

          <ul className="text-xs space-y-2 text-snow-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-madder-500" />
              <span>
                <strong className="text-snow-100">Entry:</strong> Next session Open price
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-madder-500" />
              <span>
                <strong className="text-snow-100">Exit:</strong> Close price on session +{experiment.holdingPeriodDays.value}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-madder-500" />
              <span>
                <strong className="text-snow-100">Friction:</strong> -{(
                  (experiment.costs.value.transactionBps +
                    experiment.costs.value.slippageBps) /
                  100
                ).toFixed(2)}% net deduction
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-madder-500" />
              <span>
                <strong className="text-snow-100">Overlap:</strong> Non-overlapping windows
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-end pt-5 border-t border-obsidian-600">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onRunTest(datasetSource)}
          className="flex items-center gap-2.5 px-6 py-3 bg-madder-700 hover:bg-madder-600 disabled:opacity-50 text-snow-100 rounded-lg text-sm font-semibold shadow-madder-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-snow-100" />
              <span>Computing Deterministic Metrics...</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 text-snow-100" />
              <span>Run Sample Backtest</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
