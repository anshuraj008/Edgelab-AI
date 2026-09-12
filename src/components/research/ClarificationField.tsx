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
  const isEntryDrop = field.key === "entryCondition";
  // Display positive magnitude if it's a drop threshold
  const displayValue = isEntryDrop && typeof value === "number" ? Math.abs(value) : value;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.type === "number") {
      const val = parseFloat(e.target.value) || 0;
      onChange(isEntryDrop ? Math.abs(val) : val);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="bg-midnight-750 border border-midnight-600 rounded-xl p-4 md:p-5 transition-all hover:border-midnight-500">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <label
          htmlFor={`clarify_${field.key}`}
          className="text-sm font-semibold text-slate-textPrimary"
        >
          {field.question}
        </label>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-status-warning/15 text-status-warning border border-status-warning/30">
          Required
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-textSecondary mb-3.5 bg-midnight-800/80 p-2.5 rounded-lg border border-midnight-600">
        <HelpCircle className="w-4 h-4 text-violet-hover shrink-0" />
        <span>
          <strong className="text-slate-textPrimary">Why it matters:</strong> {field.whyImportant}
        </span>
      </div>

      {field.options && field.options.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3.5">
          {field.options.map((opt) => {
            const isSelected =
              String(displayValue) === String(opt.value) ||
              String(value) === String(opt.value) ||
              (isEntryDrop && Math.abs(Number(value)) === Math.abs(Number(opt.value)));
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium border transition-all ${
                  isSelected
                    ? "bg-violet-accent text-white border-violet-hover shadow-violet-sm"
                    : "bg-midnight-800 text-slate-textSecondary border-midnight-600 hover:bg-midnight-700 hover:text-slate-textPrimary"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <input
            id={`clarify_${field.key}`}
            type={field.type === "number" ? "number" : "text"}
            step={field.type === "number" ? "0.1" : undefined}
            min={field.type === "number" && isEntryDrop ? "0.1" : undefined}
            value={displayValue}
            onChange={handleInputChange}
            placeholder={`e.g. ${isEntryDrop ? Math.abs(Number(field.suggestedValue)) : field.suggestedValue}`}
            className="w-full text-xs md:text-sm px-3.5 py-2.5 pr-16 bg-midnight-800 text-slate-textPrimary border border-midnight-600 rounded-lg focus:border-violet-accent focus:ring-1 focus:ring-violet-accent outline-none transition-colors"
          />
          {isEntryDrop && (
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-textMuted font-medium pointer-events-none">
              % drop
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
