import React, { useState } from "react";
import { MissingField, Assumption, Experiment } from "@/types/research";
import { ClarificationField } from "./ClarificationField";
import { CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

interface ClarificationPanelProps {
  missingFields: MissingField[];
  assumptions: Assumption[];
  experiment: Experiment;
  onApplyClarifications: (answers: Record<string, string | number>) => void;
  onSkipToDefine: () => void;
}

export const ClarificationPanel: React.FC<ClarificationPanelProps> = ({
  missingFields,
  assumptions,
  experiment,
  onApplyClarifications,
  onSkipToDefine,
}) => {
  // Initialize local draft state with suggested values
  const [answers, setAnswers] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {};
    missingFields.forEach((field) => {
      initial[field.key] = field.suggestedValue;
    });
    return initial;
  });

  const handleFieldChange = (key: string, val: string | number) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyClarifications(answers);
  };

  return (
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Clarification Needed: Ambiguity Detected
            </h3>
            <p className="text-xs text-slate-500">
              The AI detected {missingFields.length} ambiguous or unspecified parameters. Please confirm or customize them to avoid hidden assumptions.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>No Silent Assumptions</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingFields.map((field) => (
            <ClarificationField
              key={field.key}
              field={field}
              value={answers[field.key] ?? field.suggestedValue}
              onChange={(val) => handleFieldChange(field.key, val)}
            />
          ))}
        </div>

        {assumptions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sand-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Proposed Default Assumptions (Confirm or Edit in Next Step)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assumptions.map((item, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-amber-50/70 border border-amber-200 p-3 rounded-lg"
                >
                  <div className="font-semibold text-amber-950 flex items-center justify-between">
                    <span>{item.field}</span>
                    <span className="text-[11px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-mono">
                      {String(item.value)}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{item.reason}</p>
                  <p className="text-amber-800/80 text-[11px] mt-1 italic">
                    Risk: {item.riskIfIncorrect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-sand-200">
          <button
            type="button"
            onClick={onSkipToDefine}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-sand-100 rounded-lg transition-colors border border-transparent"
          >
            Accept Suggested Defaults & Review
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-cyprus-700 hover:bg-cyprus-600 text-slate-950 font-bold rounded-lg text-xs md:text-sm shadow-sm transition-all"
          >
            <span>Confirm Clarifications & Build Experiment</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </form>
    </div>
  );
};
