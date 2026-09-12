import React, { useState } from "react";
import { Experiment, ProvenanceSource } from "@/types/research";
import { ProvenanceBadge } from "./ProvenanceBadge";
import {
  Layers,
  Edit2,
  Check,
  PlayCircle,
  HelpCircle,
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

  // Local draft state for editing
  const [instrumentVal, setInstrumentVal] = useState(experiment.instrument.value);
  const [thresholdVal, setThresholdVal] = useState(experiment.entryCondition.value.thresholdPct);
  const [holdingDaysVal, setHoldingDaysVal] = useState(experiment.holdingPeriodDays.value);
  const [startDateVal, setStartDateVal] = useState(experiment.testPeriod.value.start);
  const [endDateVal, setEndDateVal] = useState(experiment.testPeriod.value.end);
  const [txBpsVal, setTxBpsVal] = useState(experiment.costs.value.transactionBps);
  const [slippageBpsVal, setSlippageBpsVal] = useState(experiment.costs.value.slippageBps);
  const [hypothesisVal, setHypothesisVal] = useState(experiment.hypothesis);

  const handleSaveEdit = () => {
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
          thresholdPct: thresholdVal,
          description: `Daily close falls by ${Math.abs(thresholdVal)}% or more`,
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
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand-200 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyprus-50 text-cyprus-700 border border-cyprus-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Defined Research Experiment
            </h3>
            <p className="text-xs text-slate-500">
              Review testable experiment definitions, parameter origins, and execution constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply Changes</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-slate-700 border border-sand-300 rounded-lg text-xs font-medium transition-colors"
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
          <div className="p-3.5 bg-cyprus-50/70 border border-cyprus-200 rounded-lg">
            <span className="text-[10px] font-bold text-cyprus-800 uppercase tracking-wider block mb-1">
              Formal Research Hypothesis
            </span>
            {isEditing ? (
              <textarea
                value={hypothesisVal}
                onChange={(e) => setHypothesisVal(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 bg-white border border-sand-300 rounded focus:border-cyprus-700 outline-none"
              />
            ) : (
              <p className="text-xs md:text-sm font-medium text-cyprus-950">
                "{experiment.hypothesis}"
              </p>
            )}
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Instrument */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">Instrument</span>
                <ProvenanceBadge
                  source={experiment.instrument.source}
                  confidence={experiment.instrument.confidence}
                  userEdited={experiment.instrument.userEdited}
                />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={instrumentVal}
                  onChange={(e) => setInstrumentVal(e.target.value)}
                  className="w-full text-xs p-1.5 bg-white border border-sand-300 rounded"
                />
              ) : (
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {experiment.instrument.value}
                </span>
              )}
            </div>

            {/* Timeframe */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">Timeframe</span>
                <ProvenanceBadge
                  source={experiment.timeframe.source}
                  confidence={experiment.timeframe.confidence}
                />
              </div>
              <span className="text-sm font-bold text-slate-900 uppercase font-mono">
                {experiment.timeframe.value}
              </span>
            </div>

            {/* Entry Trigger */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Entry Trigger Condition</span>
                </span>
                <ProvenanceBadge
                  source={experiment.entryCondition.source}
                  confidence={experiment.entryCondition.confidence}
                  userEdited={experiment.entryCondition.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Threshold:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={thresholdVal}
                    onChange={(e) => setThresholdVal(parseFloat(e.target.value) || -1.0)}
                    className="w-20 text-xs p-1 bg-white border border-sand-300 rounded font-mono"
                  />
                  <span className="text-xs">%</span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-amber-900 font-mono">
                    Daily Return &le; {experiment.entryCondition.value.thresholdPct}%
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Execution at next session open to prevent look-ahead bias.
                  </p>
                </div>
              )}
            </div>

            {/* Exit Condition & Holding Horizon */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyprus-700" />
                  <span>Holding Period & Exit</span>
                </span>
                <ProvenanceBadge
                  source={experiment.holdingPeriodDays.source}
                  confidence={experiment.holdingPeriodDays.confidence}
                  userEdited={experiment.holdingPeriodDays.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="252"
                    value={holdingDaysVal}
                    onChange={(e) => setHoldingDaysVal(parseInt(e.target.value, 10) || 5)}
                    className="w-20 text-xs p-1 bg-white border border-sand-300 rounded font-mono"
                  />
                  <span className="text-xs text-slate-500">trading sessions</span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-cyprus-900 font-mono">
                    {experiment.holdingPeriodDays.value} Trading Sessions
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Fixed horizon time-exit without early discretionary intervention.
                  </p>
                </div>
              )}
            </div>

            {/* Test Period */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Evaluation Date Window</span>
                </span>
                <ProvenanceBadge
                  source={experiment.testPeriod.source}
                  confidence={experiment.testPeriod.confidence}
                  userEdited={experiment.testPeriod.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="date"
                    value={startDateVal}
                    onChange={(e) => setStartDateVal(e.target.value)}
                    className="text-[11px] p-1 bg-white border border-sand-300 rounded"
                  />
                  <input
                    type="date"
                    value={endDateVal}
                    onChange={(e) => setEndDateVal(e.target.value)}
                    className="text-[11px] p-1 bg-white border border-sand-300 rounded"
                  />
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {experiment.testPeriod.value.start} &rarr; {experiment.testPeriod.value.end}
                </span>
              )}
            </div>

            {/* Costs & Slippage */}
            <div className="p-3 bg-sand-50/80 border border-sand-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transaction Costs & Slippage</span>
                </span>
                <ProvenanceBadge
                  source={experiment.costs.source}
                  confidence={experiment.costs.confidence}
                  userEdited={experiment.costs.userEdited}
                />
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div>
                    <span className="text-slate-500">Fees:</span>
                    <input
                      type="number"
                      value={txBpsVal}
                      onChange={(e) => setTxBpsVal(parseFloat(e.target.value) || 0)}
                      className="w-16 p-1 ml-1 bg-white border border-sand-300 rounded font-mono"
                    />{" "}
                    bps
                  </div>
                  <div>
                    <span className="text-slate-500">Slip:</span>
                    <input
                      type="number"
                      value={slippageBpsVal}
                      onChange={(e) => setSlippageBpsVal(parseFloat(e.target.value) || 0)}
                      className="w-16 p-1 ml-1 bg-white border border-sand-300 rounded font-mono"
                    />{" "}
                    bps
                  </div>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-900 font-mono">
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
        <div className="bg-sand-50/90 border border-sand-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-2">
            <Info className="w-4 h-4 text-cyprus-700" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Parameter Provenance & Integrity
            </h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-800">User Stated:</strong> Values extracted verbatim from your prompt.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-800">Assumption:</strong> System proposed defaults requiring verification.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-800">Clarified:</strong> Disambiguated through the clarification step.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-800">Derived:</strong> Inferred from institutional quant conventions.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-sand-200">
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Auditable Research Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Deterministic calculations will be executed in TypeScript on authentic daily candles. No LLM hallucinations in metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-sand-200">
        <span className="text-xs text-slate-500">
          Status:{" "}
          <span className="font-semibold text-emerald-700 uppercase tracking-wider">
            Ready For Sample Backtesting
          </span>
        </span>
        <button
          type="button"
          onClick={onProceedToTest}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyprus-700 hover:bg-cyprus-800 text-white rounded-lg text-xs md:text-sm font-medium shadow-sm transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Execute Deterministic Test</span>
        </button>
      </div>
    </div>
  );
};
