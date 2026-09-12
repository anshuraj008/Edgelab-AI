import React from "react";
import { LearnAnalysis } from "@/types/research";
import {
  FileText,
  Compass,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface EvidenceVsConclusionProps {
  learn: LearnAnalysis;
}

export const EvidenceVsConclusion: React.FC<EvidenceVsConclusionProps> = ({ learn }) => {
  return (
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-xl p-6 md:p-8 shadow-card transition-all space-y-6">
      <div className="flex items-center justify-between border-b border-obsidian-600 pb-5">
        <div>
          <span className="text-[10px] font-bold text-madder-400 uppercase tracking-wider block mb-1">
            Research Synthesis & Rigor
          </span>
          <h3 className="text-base font-bold text-snow-100">
            Evidence vs. Reasonable Interpretation
          </h3>
          <p className="text-xs text-snow-400">
            Critical separation between factual sample statistics and bounded probabilistic conclusions.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-madder-300 bg-madder-700/15 px-3 py-1.5 rounded-full border border-madder-700/30 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-madder-400" />
          <span>Non-Dogmatic Framing</span>
        </div>
      </div>

      {/* 2-Column Split: Data Shows vs We Conclude */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: What the Data Shows */}
        <div className="bg-obsidian-750/80 border border-obsidian-600 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-status-success font-bold text-xs uppercase tracking-wider border-b border-obsidian-600 pb-3">
            <FileText className="w-4 h-4 text-status-success" />
            <span>1. What the Data Shows (Factual Evidence)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-snow-400">
            {learn.factualSummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: What We Can Reasonably Conclude */}
        <div className="bg-obsidian-750/80 border border-obsidian-600 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-madder-400 font-bold text-xs uppercase tracking-wider border-b border-obsidian-600 pb-3">
            <Compass className="w-4 h-4 text-madder-400" />
            <span>2. What We Can Reasonably Conclude</span>
          </div>
          <ul className="space-y-2.5 text-xs text-snow-400">
            {learn.cautiousConclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-madder-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research Risks & Methodological Pitfalls */}
      <div className="pt-3">
        <h4 className="text-[11px] font-bold text-snow-500 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning" />
          <span>Research Risks & Methodological Biases Acknowledged</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {learn.researchRisks.map((risk, idx) => {
            const severityStyle =
              risk.severity === "high"
                ? "bg-status-error/15 border-status-error/30 text-status-error"
                : risk.severity === "medium"
                ? "bg-status-warning/15 border-status-warning/30 text-status-warning"
                : "bg-obsidian-700 border-obsidian-600 text-snow-400";

            return (
              <div
                key={idx}
                className="p-4 bg-obsidian-750/90 border border-obsidian-600 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-snow-100">
                    {risk.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${severityStyle}`}
                  >
                    {risk.severity} risk
                  </span>
                </div>
                <p className="text-[11px] text-snow-400">{risk.description}</p>
                <div className="text-[11px] text-madder-300 bg-madder-700/15 p-2.5 rounded-lg border border-madder-700/30 font-medium">
                  <strong className="text-snow-100">Mitigation:</strong> {risk.mitigation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
