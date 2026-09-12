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
    <div className="bg-midnight-800 border border-midnight-600 rounded-xl p-6 md:p-8 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-midnight-600 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-violet-accent/15 border border-violet-accent/30 text-violet-hover shadow-violet-sm">
            <Sparkles className="w-5 h-5 text-violet-hover" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-textPrimary">
              Iterate Research: What to Investigate Next
            </h3>
            <p className="text-xs text-slate-textSecondary">
              Select a follow-up hypothesis to test robustness, remove bias, or explore alternative parameters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetWorkflow}
          className="flex items-center gap-2 text-xs text-slate-textSecondary hover:text-slate-textPrimary bg-midnight-750 hover:bg-midnight-700 border border-midnight-600 px-3.5 py-2 rounded-lg transition-colors"
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
            className="group flex items-start justify-between text-left p-4 bg-midnight-750 hover:bg-violet-soft border border-midnight-600 hover:border-violet-accent/50 rounded-xl transition-all shadow-xs"
          >
            <span className="text-xs font-medium text-slate-textPrimary group-hover:text-violet-hover pr-3 transition-colors">
              {q}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-textMuted group-hover:text-violet-hover shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
};
