import React from "react";
import { ProvenanceSource } from "@/types/research";
import { User, Lightbulb, CheckCircle2, Cpu } from "lucide-react";

interface ProvenanceBadgeProps {
  source: ProvenanceSource;
  confidence?: number;
  userEdited?: boolean;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  confidence,
  userEdited,
  className = "",
}) => {
  const config = {
    user: {
      label: userEdited ? "User Edited" : "User Stated",
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <User className="w-3 h-3 text-blue-600 mr-1 inline" />,
      description: "Directly specified in the query by the user",
    },
    assumption: {
      label: "System Assumption",
      bg: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <Lightbulb className="w-3 h-3 text-amber-600 mr-1 inline" />,
      description: "Proposed default requiring user confirmation",
    },
    clarified: {
      label: "Clarified",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1 inline" />,
      description: "Confirmed via targeted clarification step",
    },
    derived: {
      label: "Derived Context",
      bg: "bg-purple-50 border-purple-200 text-purple-800",
      icon: <Cpu className="w-3 h-3 text-purple-600 mr-1 inline" />,
      description: "Inferred from market convention & semantics",
    },
  }[source];

  return (
    <span
      title={config.description}
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {confidence !== undefined && confidence < 1.0 && (
        <span className="ml-1 opacity-75 text-[10px]">({Math.round(confidence * 100)}%)</span>
      )}
    </span>
  );
};
