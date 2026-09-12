import React, { useState } from "react";
import { MissingField, Assumption, Experiment } from "@/types/research";
import { ClarificationField } from "./ClarificationField";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

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
    <div className="bg-midnight-800 border border-midnight-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-midnight-600 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-status-warning/15 text-status-warning border border-status-warning/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-textPrimary">
              Clarification Needed: Ambiguity Detected
            </h3>
            <p className="text-xs text-slate-textSecondary">
              The assistant detected {missingFields.length} ambiguous or unspecified parameters. Please confirm or customize them to avoid hidden assumptions.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-status-success bg-status-success/15 px-3 py-1.5 rounded-full border border-status-success/30 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>No Hidden Assumptions</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="mt-6 pt-5 border-t border-midnight-600">
            <h4 className="text-[11px] font-bold text-slate-textMuted uppercase tracking-wider mb-3">
              Proposed Default Assumptions (Confirm or Edit in Next Step)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {assumptions.map((item, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-midnight-750/70 border border-midnight-600 p-3.5 rounded-xl"
                >
                  <div className="font-semibold text-slate-textPrimary flex items-center justify-between">
                    <span>{item.field}</span>
                    <span className="text-[11px] bg-status-warning/15 text-status-warning border border-status-warning/30 px-2 py-0.5 rounded font-mono">
                      {String(item.value)}
                    </span>
                  </div>
                  <p className="text-slate-textSecondary mt-1.5">{item.reason}</p>
                  <p className="text-status-warning/90 text-[11px] mt-1.5 italic">
                    Risk: {item.riskIfIncorrect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-midnight-600">
          <button
            type="button"
            onClick={onSkipToDefine}
            className="px-4 py-2.5 text-xs font-medium text-slate-textSecondary hover:text-slate-textPrimary hover:bg-midnight-750 rounded-lg transition-colors border border-transparent"
          >
            Accept Suggested Defaults & Review
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-accent hover:bg-violet-hover text-white rounded-lg text-xs md:text-sm font-semibold shadow-violet-sm transition-all"
          >
            <span>Confirm Clarifications & Build Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
