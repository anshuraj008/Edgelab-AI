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
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all">
      <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyprus-50 text-cyprus-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Iterate Research: What to Investigate Next
            </h3>
            <p className="text-xs text-slate-500">
              Select a follow-up hypothesis to test robustness, remove bias, or explore alternative parameters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetWorkflow}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-sand-100 hover:bg-sand-200 border border-sand-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Research Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(q)}
            className="group flex items-start justify-between text-left p-3.5 bg-sand-50 hover:bg-cyprus-50/70 border border-sand-200 hover:border-cyprus-300 rounded-lg transition-all"
          >
            <span className="text-xs font-medium text-slate-800 group-hover:text-cyprus-900 pr-2">
              {q}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyprus-700 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
};
