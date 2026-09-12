import React, { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface ResearchPromptProps {
  initialQuery?: string;
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES = [
  "Does buying NIFTY after a sharp fall work?",
  "Is buying Bank Nifty after a 2% crash profitable?",
  "Does buying after 3 consecutive red days beat the market?",
  "What happens if we buy NIFTY when it drops 1.5% in a single day?",
];

export const ResearchPrompt: React.FC<ResearchPromptProps> = ({
  initialQuery = "",
  onSubmit,
  isLoading,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleChipClick = (example: string) => {
    setQuery(example);
    onSubmit(example);
  };

  return (
    <div className="bg-white border border-sand-300 rounded-xl p-6 shadow-card transition-all">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-cyprus-50 text-cyprus-700">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            What market idea do you want to investigate?
          </h2>
          <p className="text-xs text-slate-500">
            Ask any natural language trading question. We will identify ambiguities, define assumptions, and construct a testable experiment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="e.g. Does buying NIFTY after a sharp fall work over a 5-day holding period?"
            rows={3}
            disabled={isLoading}
            className="w-full p-4 pr-12 text-sm md:text-base border border-sand-300 rounded-lg bg-sand-50 focus:bg-white focus:border-cyprus-700 focus:ring-1 focus:ring-cyprus-700 outline-none transition-all placeholder:text-slate-400 resize-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            aria-label="Structure research question"
            className="absolute bottom-3.5 right-3.5 p-2.5 rounded-lg bg-cyprus-700 hover:bg-cyprus-600 disabled:opacity-40 disabled:hover:bg-cyprus-700 text-slate-950 font-bold transition-all shadow-sm flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <ArrowRight className="w-4 h-4 text-slate-950" />
            )}
          </button>
        </div>

        {isLoading && (
          <div
            aria-live="polite"
            className="mt-3 flex items-center gap-2 text-xs font-medium text-cyprus-700 bg-cyprus-50 px-3 py-2 rounded-md border border-cyprus-200"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Structuring your idea into testable parameters and detecting missing assumptions...</span>
          </div>
        )}
      </form>

      <div className="mt-5 pt-4 border-t border-sand-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Example Research Hypotheses
        </span>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              disabled={isLoading}
              onClick={() => handleChipClick(example)}
              className="text-xs bg-sand-100 hover:bg-sand-200 text-slate-700 border border-sand-300 px-3 py-1.5 rounded-lg transition-colors text-left flex items-center gap-1.5"
            >
              <Search className="w-3 h-3 text-slate-400" />
              <span>{example}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
