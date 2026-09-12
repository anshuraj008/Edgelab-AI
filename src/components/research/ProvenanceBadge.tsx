import React from "react";
import { ProvenanceSource } from "@/types/research";
import { User, Lightbulb, CheckCircle2, Cpu } from "lucide-react";

interface ProvenanceBadgeProps {
  source: ProvenanceSource;
  userEdited?: boolean;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  userEdited,
  className = "",
}) => {
  const config = {
    user: {
      label: userEdited ? "User Edited" : "User Stated",
      bg: "bg-blue-950/60 border-blue-800/80 text-blue-300",
      icon: <User className="w-3 h-3 text-blue-400 mr-1 inline" />,
      description: "Directly specified in the query by the user",
    },
    assumption: {
      label: "System Assumption",
      bg: "bg-amber-950/50 border-amber-700/60 text-amber-300",
      icon: <Lightbulb className="w-3 h-3 text-amber-400 mr-1 inline" />,
      description: "Proposed default requiring user confirmation",
    },
    clarified: {
      label: "Clarified",
      bg: "bg-emerald-950/50 border-emerald-700/60 text-emerald-300",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1 inline" />,
      description: "Confirmed via targeted clarification step",
    },
    derived: {
      label: "AI Inferred",
      bg: "bg-coolTeal-950/70 border-coolTeal-500/60 text-coolTeal-300",
      icon: <Cpu className="w-3 h-3 text-coolTeal-400 mr-1 inline" />,
      description: "Inferred from trading context and standard conventions",
    },
  }[source];

  return (
    <span
      title={config.description}
      className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-colors ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
