import React from "react";
import { Stage } from "@/types/research";
import { Check, HelpCircle, Layers, PlayCircle, BarChart3, MessageSquare } from "lucide-react";

interface StageStepperProps {
  currentStage: Stage;
  onSelectStage: (stage: Stage) => void;
  maxReachedStage: Stage;
}

const STAGES: { key: Stage; label: string; number: string; icon: any }[] = [
  { key: "ask", label: "1. Ask", number: "1", icon: MessageSquare },
  { key: "clarify", label: "2. Clarify", number: "2", icon: HelpCircle },
  { key: "define", label: "3. Define", number: "3", icon: Layers },
  { key: "test", label: "4. Test", number: "4", icon: PlayCircle },
  { key: "learn", label: "5. Learn", number: "5", icon: BarChart3 },
];

const STAGE_ORDER: Stage[] = ["ask", "clarify", "define", "test", "learn"];

export const StageStepper: React.FC<StageStepperProps> = ({
  currentStage,
  onSelectStage,
  maxReachedStage,
}) => {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const maxIndex = STAGE_ORDER.indexOf(maxReachedStage);

  return (
    <nav aria-label="Research workflow steps" className="w-full">
      <div className="flex items-center justify-between border-b border-obsidian-600 pb-3 overflow-x-auto gap-2">
        {STAGES.map((s, idx) => {
          const isActive = s.key === currentStage;
          const isCompleted = idx < currentIndex;
          const isAccessible = idx <= Math.max(currentIndex, maxIndex);
          const Icon = s.icon;

          return (
            <button
              key={s.key}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onSelectStage(s.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-madder-700 text-snow-100 shadow-madder-sm ring-1 ring-madder-500"
                  : isCompleted
                  ? "bg-obsidian-750 text-snow-100 hover:bg-obsidian-700 border border-obsidian-600"
                  : isAccessible
                  ? "bg-obsidian-800 text-snow-400 hover:bg-obsidian-750 border border-obsidian-600"
                  : "bg-transparent text-snow-500 opacity-40 cursor-not-allowed border border-transparent"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-status-success/20 text-status-success border border-status-success/40"
                    : "bg-obsidian-700 text-snow-500"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 text-status-success" /> : s.number}
              </div>
              <span className="hidden sm:inline">{s.label.split(". ")[1]}</span>
              <span className="sm:hidden">{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
