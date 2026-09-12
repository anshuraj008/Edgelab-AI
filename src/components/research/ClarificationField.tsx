import React from "react";
import { MissingField } from "@/types/research";
import { HelpCircle } from "lucide-react";

interface ClarificationFieldProps {
  field: MissingField;
  value: string | number;
  onChange: (value: string | number) => void;
}

export const ClarificationField: React.FC<ClarificationFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <div className="bg-sand-50 border border-sand-300 rounded-lg p-4 transition-all hover:border-sand-400">
      <div className="flex items-start justify-between gap-2 mb-2">
        <label
          htmlFor={`clarify_${field.key}`}
          className="text-sm font-semibold text-slate-800"
        >
          {field.question}
        </label>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
          Required Parameter
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 bg-white p-2 rounded border border-sand-200">
        <HelpCircle className="w-3.5 h-3.5 text-cyprus-700 shrink-0" />
        <span>
          <strong className="text-slate-700">Why it matters:</strong> {field.whyImportant}
        </span>
      </div>

      {field.options && field.options.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {field.options.map((opt) => {
            const isSelected = String(value) === String(opt.value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-all ${
                  isSelected
                    ? "bg-cyprus-700 text-white border-cyprus-800 shadow-xs"
                    : "bg-white text-slate-700 border-sand-300 hover:bg-sand-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id={`clarify_${field.key}`}
          type={field.type === "number" ? "number" : "text"}
          step={field.type === "number" ? "any" : undefined}
          value={value}
          onChange={(e) =>
            onChange(field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
          }
          placeholder={`e.g. ${field.suggestedValue}`}
          className="w-full text-xs md:text-sm px-3 py-2 bg-white border border-sand-300 rounded-md focus:border-cyprus-700 focus:ring-1 focus:ring-cyprus-700 outline-none"
        />
      </div>
    </div>
  );
};
