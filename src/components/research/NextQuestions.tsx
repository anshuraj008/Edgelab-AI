import React from "react";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface NextQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  onResetWorkflow: () => void;
}

export const NextQuestions: React.FC<NextQuestionsProps> = ({
  questions,
  onSelectQuestion,
  onResetWorkflow,
}) => {
  return (
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-obsidian-600 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-madder-700/15 border border-madder-700/30 text-madder-400 shadow-madder-sm">
            <Sparkles className="w-5 h-5 text-madder-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-snow-100">
              Iterate Research: What to Investigate Next
            </h3>
            <p className="text-xs text-snow-400">
              Select a follow-up hypothesis to test robustness, remove bias, or explore alternative parameters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetWorkflow}
          className="flex items-center gap-2 text-xs text-snow-400 hover:text-snow-100 bg-obsidian-750 hover:bg-obsidian-700 border border-obsidian-600 px-3.5 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Research Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(q)}
            className="group flex items-start justify-between text-left p-4 bg-obsidian-750 hover:bg-madder-700/15 border border-obsidian-600 hover:border-madder-600/50 rounded-xl transition-all shadow-xs"
          >
            <span className="text-xs font-medium text-snow-100 group-hover:text-madder-300 pr-3 transition-colors">
              {q}
            </span>
            <ArrowRight className="w-4 h-4 text-snow-500 group-hover:text-madder-400 shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
};
