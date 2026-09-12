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
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyprus-50 text-cyprus-700 border border-cyprus-200">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Deterministic Sample Backtest Engine
            </h3>
            <p className="text-xs text-slate-500">
              Run quantitative backtest across calibrated sample price series with transparent execution rules and explicit costs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auditable Calculation Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Dataset Choice Card */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Evaluation Dataset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDatasetSource("nifty-historical")}
              className={`p-4 rounded-lg border text-left transition-all ${
                datasetSource === "nifty-historical"
                  ? "bg-cyprus-50/60 border-cyprus-700 ring-1 ring-cyprus-700"
                  : "bg-sand-50/70 border-sand-300 hover:border-sand-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  Bundled Calibrated Sample Dataset
                </span>
                {datasetSource === "nifty-historical" && (
                  <CheckCircle2 className="w-4 h-4 text-cyprus-700" />
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Calibrated daily OHLCV series spanning 2015–2024 (~2,450 sessions) across bull, bear, and recovery market regimes.
              </p>
              <span className="mt-2 inline-block text-[10px] bg-cyprus-100 text-cyprus-800 px-2 py-0.5 rounded font-mono">
                Calibrated Sample (Prototype)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDatasetSource("simulated-market")}
              className={`p-4 rounded-lg border text-left transition-all ${
                datasetSource === "simulated-market"
                  ? "bg-cyprus-50/60 border-cyprus-700 ring-1 ring-cyprus-700"
                  : "bg-sand-50/70 border-sand-300 hover:border-sand-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  Stress Simulation Series
                </span>
                {datasetSource === "simulated-market" && (
                  <CheckCircle2 className="w-4 h-4 text-cyprus-700" />
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Deterministic stress-tested simulated market with elevated jump risk and volatility clustering.
              </p>
              <span className="mt-2 inline-block text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                Stress Simulation
              </span>
            </button>
          </div>
        </div>

        {/* Execution Rules Summary */}
        <div className="bg-sand-50/90 border border-sand-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-cyprus-700" />
            <span>Execution Semantics</span>
          </div>

          <ul className="text-xs space-y-1.5 text-slate-600">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyprus-600" />
              <span>
                <strong>Entry:</strong> Next session Open price
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyprus-600" />
              <span>
                <strong>Exit:</strong> Close price on session +{experiment.holdingPeriodDays.value}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyprus-600" />
              <span>
                <strong>Friction:</strong> -{(
                  (experiment.costs.value.transactionBps +
                    experiment.costs.value.slippageBps) /
                  100
                ).toFixed(2)}% net deduction
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyprus-600" />
              <span>
                <strong>Overlap:</strong> Non-overlapping windows
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-sand-200">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onRunTest(datasetSource)}
          className="flex items-center gap-2 px-6 py-3 bg-cyprus-700 hover:bg-cyprus-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Computing Deterministic Metrics...</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              <span>Run Sample Backtest</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
