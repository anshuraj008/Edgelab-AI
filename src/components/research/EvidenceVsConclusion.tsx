import React from "react";
import { LearnAnalysis } from "@/types/research";
import {
  FileText,
  Compass,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface EvidenceVsConclusionProps {
  learn: LearnAnalysis;
}

export const EvidenceVsConclusion: React.FC<EvidenceVsConclusionProps> = ({ learn }) => {
  return (
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all space-y-6">
      <div className="flex items-center justify-between border-b border-sand-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyprus-800 uppercase tracking-wider block">
            Research Synthesis & Rigor
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            Evidence vs. Reasonable Interpretation
          </h3>
          <p className="text-xs text-slate-500">
            Critical separation between factual sample statistics and bounded probabilistic conclusions.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-cyprus-800 bg-cyprus-50 px-3 py-1.5 rounded-full border border-cyprus-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyprus-700" />
          <span>Non-Dogmatic Framing</span>
        </div>
      </div>

      {/* 2-Column Split: Data Shows vs We Conclude */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: What the Data Shows */}
        <div className="bg-sand-50/80 border border-sand-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-cyprus-900 font-bold text-xs uppercase tracking-wider border-b border-sand-200 pb-2">
            <FileText className="w-4 h-4 text-cyprus-700" />
            <span>1. What the Data Shows (Factual Evidence)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {learn.factualSummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyprus-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: What We Can Reasonably Conclude */}
        <div className="bg-sand-50/80 border border-sand-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-sand-200 pb-2">
            <Compass className="w-4 h-4 text-cyprus-700" />
            <span>2. What We Can Reasonably Conclude</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {learn.cautiousConclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research Risks & Methodological Pitfalls */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Research Risks & Methodological Biases Acknowledged</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learn.researchRisks.map((risk, idx) => {
            const severityBg =
              risk.severity === "high"
                ? "bg-brick-50 border-brick-200 text-brick-900"
                : risk.severity === "medium"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-sand-100 border-sand-300 text-slate-800";

            return (
              <div
                key={idx}
                className="p-3 bg-white border border-sand-200 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {risk.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${severityBg}`}
                  >
                    {risk.severity} risk
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{risk.description}</p>
                <div className="text-[11px] text-cyprus-800 bg-cyprus-50/50 p-1.5 rounded border border-cyprus-100 font-medium">
                  <strong>Mitigation:</strong> {risk.mitigation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
