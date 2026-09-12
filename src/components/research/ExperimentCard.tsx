import React, { useState } from "react";
import { Experiment, ProvenanceSource } from "@/types/research";
import { ProvenanceBadge } from "./ProvenanceBadge";
import {
  Layers,
  Edit2,
  Check,
  PlayCircle,
  ShieldAlert,
  Info,
  DollarSign,
  Calendar,
  Clock,
  TrendingDown,
} from "lucide-react";

interface ExperimentCardProps {
  experiment: Experiment;
  onUpdateExperiment: (updates: Partial<Experiment>) => void;
  onProceedToTest: () => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onUpdateExperiment,
  onProceedToTest,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Local draft state for editing (store drop threshold as positive magnitude)
  const [instrumentVal, setInstrumentVal] = useState(experiment.instrument.value);
  const [thresholdMagnitude, setThresholdMagnitude] = useState(
    Math.abs(experiment.entryCondition.value.thresholdPct)
  );
  const [holdingDaysVal, setHoldingDaysVal] = useState(experiment.holdingPeriodDays.value);
  const [startDateVal, setStartDateVal] = useState(experiment.testPeriod.value.start);
  const [endDateVal, setEndDateVal] = useState(experiment.testPeriod.value.end);
  const [txBpsVal, setTxBpsVal] = useState(experiment.costs.value.transactionBps);
  const [slippageBpsVal, setSlippageBpsVal] = useState(experiment.costs.value.slippageBps);
  const [hypothesisVal, setHypothesisVal] = useState(experiment.hypothesis);

  const handleSaveEdit = () => {
    const finalThreshold = -Math.abs(thresholdMagnitude || 1.0);
    onUpdateExperiment({
      instrument: {
        ...experiment.instrument,
        value: instrumentVal,
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      entryCondition: {
        ...experiment.entryCondition,
        value: {
          ...experiment.entryCondition.value,
          thresholdPct: finalThreshold,
          description: `Daily close falls by ${Math.abs(finalThreshold)}% or more`,
        },
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      holdingPeriodDays: {
        ...experiment.holdingPeriodDays,
        value: holdingDaysVal,
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      exitCondition: {
        ...experiment.exitCondition,
        value: {
          type: "time_exit",
          holdingDays: holdingDaysVal,
          description: `Exit position after ${holdingDaysVal} trading sessions`,
        },
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      testPeriod: {
        ...experiment.testPeriod,
        value: { start: startDateVal, end: endDateVal },
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      costs: {
        ...experiment.costs,
        value: { transactionBps: txBpsVal, slippageBps: slippageBpsVal },
        source: "user" as ProvenanceSource,
        userEdited: true,
      },
      hypothesis: hypothesisVal,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-cyber-800 border border-cyber-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyber-600 pb-5 mb-6 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-coolTeal-500/15 border border-coolTeal-500/30 text-coolTeal-400 shadow-teal-sm">
            <Layers className="w-5 h-5 text-coolTeal-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-icy-100">
              Defined Research Experiment
            </h3>
            <p className="text-xs text-icy-300">
              Review testable experiment definitions, parameter origins, and execution constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-status-success/20 text-status-success border border-status-success/40 hover:bg-status-success/30 rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply Changes</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyber-750 hover:bg-cyber-700 text-icy-300 hover:text-icy-100 border border-cyber-600 rounded-lg text-xs font-medium transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Parameters</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Experiment Parameters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hypothesis Banner */}
          <div className="p-4 bg-cyber-750/90 border border-cyber-600 rounded-xl">
            <span className="text-[10px] font-bold text-coolTeal-400 uppercase tracking-wider block mb-1.5">
              Formal Research Hypothesis
            </span>
            {isEditing ? (
              <textarea
                value={hypothesisVal}
                onChange={(e) => setHypothesisVal(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 bg-cyber-800 text-icy-100 border border-cyber-600 rounded-lg focus:border-coolTeal-500 outline-none"
              />
            ) : (
              <p className="text-xs md:text-sm font-medium text-icy-100">
                &ldquo;{experiment.hypothesis}&rdquo;
              </p>
            )}
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Instrument */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300">Instrument</span>
                <ProvenanceBadge
                  source={experiment.instrument.source}
                  userEdited={experiment.instrument.userEdited}
                />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={instrumentVal}
                  onChange={(e) => setInstrumentVal(e.target.value)}
                  className="w-full text-xs p-2 bg-cyber-800 text-icy-100 border border-cyber-600 rounded-lg"
                />
              ) : (
                <span className="text-sm font-bold text-icy-100 font-mono">
                  {experiment.instrument.value}
                </span>
              )}
            </div>

            {/* Timeframe */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300">Timeframe</span>
                <ProvenanceBadge
                  source={experiment.timeframe.source}
                />
              </div>
              <span className="text-sm font-bold text-icy-100 uppercase font-mono">
                {experiment.timeframe.value}
              </span>
            </div>

            {/* Entry Trigger */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-status-warning" />
                  <span>Entry Trigger Condition</span>
                </span>
                <ProvenanceBadge
                  source={experiment.entryCondition.source}
                  userEdited={experiment.entryCondition.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-icy-300">Decline:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={thresholdMagnitude}
                    onChange={(e) => setThresholdMagnitude(Math.abs(parseFloat(e.target.value) || 1.0))}
                    className="w-20 text-xs p-1.5 bg-cyber-800 text-icy-100 border border-cyber-600 rounded font-mono"
                  />
                  <span className="text-xs text-icy-300 font-medium">% drop</span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-status-warning font-mono">
                    Daily Return &le; -{Math.abs(experiment.entryCondition.value.thresholdPct)}% ({Math.abs(experiment.entryCondition.value.thresholdPct)}% drop)
                  </span>
                  <p className="text-[11px] text-icy-500 mt-1">
                    Execution at next session open to eliminate look-ahead bias.
                  </p>
                </div>
              )}
            </div>

            {/* Exit Condition & Holding Horizon */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-coolTeal-400" />
                  <span>Holding Period & Exit</span>
                </span>
                <ProvenanceBadge
                  source={experiment.holdingPeriodDays.source}
                  userEdited={experiment.holdingPeriodDays.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="252"
                    value={holdingDaysVal}
                    onChange={(e) => setHoldingDaysVal(parseInt(e.target.value, 10) || 5)}
                    className="w-20 text-xs p-1.5 bg-cyber-800 text-icy-100 border border-cyber-600 rounded font-mono"
                  />
                  <span className="text-xs text-icy-300">trading sessions</span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-coolTeal-400 font-mono">
                    {experiment.holdingPeriodDays.value} Trading Sessions
                  </span>
                  <p className="text-[11px] text-icy-500 mt-1">
                    Fixed horizon time-exit without early discretionary intervention.
                  </p>
                </div>
              )}
            </div>

            {/* Test Period */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-icy-500" />
                  <span>Evaluation Date Window</span>
                </span>
                <ProvenanceBadge
                  source={experiment.testPeriod.source}
                  userEdited={experiment.testPeriod.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="date"
                    value={startDateVal}
                    onChange={(e) => setStartDateVal(e.target.value)}
                    className="text-[11px] p-1.5 bg-cyber-800 text-icy-100 border border-cyber-600 rounded"
                  />
                  <input
                    type="date"
                    value={endDateVal}
                    onChange={(e) => setEndDateVal(e.target.value)}
                    className="text-[11px] p-1.5 bg-cyber-800 text-icy-100 border border-cyber-600 rounded"
                  />
                </div>
              ) : (
                <span className="text-xs font-bold text-icy-100 font-mono">
                  {experiment.testPeriod.value.start} &rarr; {experiment.testPeriod.value.end}
                </span>
              )}
            </div>

            {/* Costs & Slippage */}
            <div className="p-3.5 bg-cyber-750/90 border border-cyber-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-icy-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-status-success" />
                  <span>Transaction Costs & Slippage</span>
                </span>
                <ProvenanceBadge
                  source={experiment.costs.source}
                  userEdited={experiment.costs.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-icy-300">Fees:</span>
                    <input
                      type="number"
                      value={txBpsVal}
                      onChange={(e) => setTxBpsVal(parseFloat(e.target.value) || 0)}
                      className="w-16 p-1 ml-1 bg-cyber-800 text-icy-100 border border-cyber-600 rounded font-mono"
                    />{" "}
                    bps
                  </div>
                  <div>
                    <span className="text-icy-300">Slip:</span>
                    <input
                      type="number"
                      value={slippageBpsVal}
                      onChange={(e) => setSlippageBpsVal(parseFloat(e.target.value) || 0)}
                      className="w-16 p-1 ml-1 bg-cyber-800 text-icy-100 border border-cyber-600 rounded font-mono"
                    />{" "}
                    bps
                  </div>
                </div>
              ) : (
                <span className="text-xs font-bold text-status-success font-mono">
                  {experiment.costs.value.transactionBps} bps fees +{" "}
                  {experiment.costs.value.slippageBps} bps slippage (
                  {(
                    (experiment.costs.value.transactionBps +
                      experiment.costs.value.slippageBps) /
                    100
                  ).toFixed(2)}
                  % round-trip)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Why This Matters & Provenance Guide */}
        <div className="bg-cyber-750/90 border border-cyber-600 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-cyber-600 pb-3">
            <Info className="w-4 h-4 text-coolTeal-400" />
            <h4 className="text-[11px] font-bold text-icy-500 uppercase tracking-wider">
              Parameter Provenance & Integrity
            </h4>
          </div>

          <div className="space-y-3 text-xs text-icy-300">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <div>
                <strong className="text-icy-100">User Stated:</strong> Values extracted verbatim from your prompt.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-status-warning shrink-0 mt-1.5" />
              <div>
                <strong className="text-icy-100">System Assumption:</strong> Proposed default requiring confirmation.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-status-success shrink-0 mt-1.5" />
              <div>
                <strong className="text-icy-100">Clarified:</strong> Disambiguated through the clarification step.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-coolTeal-400 shrink-0 mt-1.5" />
              <div>
                <strong className="text-icy-100">AI Inferred:</strong> Inferred from trading context and standard conventions.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cyber-600">
            <div className="flex items-center gap-1.5 text-xs text-status-warning font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-status-warning" />
              <span>Auditable Research Guarantee</span>
            </div>
            <p className="text-[11px] text-icy-500">
              Deterministic calculations are executed in TypeScript using the bundled calibrated sample dataset. Zero LLM hallucinations in metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-cyber-600">
        <span className="text-xs text-icy-500">
          Status:{" "}
          <span className="font-semibold text-status-success uppercase tracking-wider">
            Ready For Sample Backtesting
          </span>
        </span>
        <button
          type="button"
          onClick={onProceedToTest}
          className="flex items-center gap-2 px-6 py-2.5 bg-coolTeal-500 hover:bg-coolTeal-400 text-cyber-950 font-bold rounded-lg text-xs md:text-sm shadow-teal-sm transition-all"
        >
          <PlayCircle className="w-4 h-4 text-cyber-950 font-bold" />
          <span>Execute Deterministic Test</span>
        </button>
      </div>
    </div>
  );
};
