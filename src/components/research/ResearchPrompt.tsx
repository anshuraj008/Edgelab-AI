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
    <div className="relative bg-cyber-800 border border-cyber-600 rounded-xl p-6 md:p-8 shadow-card overflow-hidden">
      {/* Futuristic Cool Teal Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-coolTeal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3.5 mb-4">
        <div className="p-2.5 rounded-lg bg-coolTeal-500/15 border border-coolTeal-500/30 text-coolTeal-400 shadow-teal-sm">
          <Sparkles className="w-5 h-5 text-coolTeal-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-icy-100">
            What market idea do you want to investigate?
          </h2>
          <p className="text-xs text-icy-300">
            Ask any natural language trading question. The assistant structures ambiguities, defines testable assumptions, and builds an auditable experiment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
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
            className="w-full p-4 pr-14 text-sm md:text-base border border-cyber-600 rounded-xl bg-cyber-750 text-icy-100 focus:bg-cyber-750 focus:border-coolTeal-500 focus:ring-1 focus:ring-coolTeal-500 outline-none transition-all placeholder:text-icy-500 resize-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            aria-label="Structure research question"
            className="absolute bottom-3.5 right-3.5 p-3 rounded-lg bg-coolTeal-500 hover:bg-coolTeal-400 disabled:opacity-40 disabled:hover:bg-coolTeal-500 text-cyber-950 font-semibold transition-all shadow-teal-sm flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyber-950" />
            ) : (
              <ArrowRight className="w-4 h-4 text-cyber-950 font-bold" />
            )}
          </button>
        </div>

        {isLoading && (
          <div
            aria-live="polite"
            className="mt-3.5 flex items-center gap-2.5 text-xs font-medium text-coolTeal-300 bg-coolTeal-950/60 px-4 py-2.5 rounded-lg border border-coolTeal-500/40"
          >
            <Loader2 className="w-4 h-4 animate-spin text-coolTeal-400" />
            <span>Structuring your idea into testable parameters and detecting missing assumptions...</span>
          </div>
        )}
      </form>

      <div className="mt-6 pt-5 border-t border-cyber-600">
        <span className="text-[11px] font-bold text-icy-500 uppercase tracking-wider block mb-3">
          Example Research Hypotheses
        </span>
        <div className="flex flex-wrap gap-2.5">
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              disabled={isLoading}
              onClick={() => handleChipClick(example)}
              className="text-xs bg-cyber-750 hover:bg-cyber-700 text-icy-300 hover:text-icy-100 border border-cyber-600 hover:border-coolTeal-500/60 px-3.5 py-2 rounded-lg transition-all text-left flex items-center gap-2 shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-icy-500" />
              <span>{example}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
