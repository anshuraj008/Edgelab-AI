"use client";

import React, { useReducer, useCallback, useMemo } from "react";
import {
  Stage,
  ResearchState,
  ResearchAction,
  Experiment,
  BacktestResult,
} from "@/types/research";
import { StageStepper } from "./StageStepper";
import { ResearchPrompt } from "./ResearchPrompt";
import { ClarificationPanel } from "./ClarificationPanel";
import { ExperimentCard } from "./ExperimentCard";
import { TestPanel } from "./TestPanel";
import { ResultSummary } from "./ResultSummary";
import { EvidenceVsConclusion } from "./EvidenceVsConclusion";
import { NextQuestions } from "./NextQuestions";
import { EdgeLabLogo } from "@/components/brand/EdgeLabLogo";
import { mergeClarificationAnswers } from "@/lib/ai/clarification-merger";
import { AlertCircle, History, Sparkles, BookOpen } from "lucide-react";

const STAGE_ORDER: Stage[] = ["ask", "clarify", "define", "test", "learn"];

const initialState: ResearchState = {
  stage: "ask",
  query: "",
  experiment: null,
  missingFields: [],
  assumptions: [],
  clarificationAnswers: {},
  result: null,
  status: "idle",
  errorMessage: null,
  history: [],
};

function researchReducer(state: ResearchState, action: ResearchAction): ResearchState {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, stage: action.payload, errorMessage: null };

    case "SET_QUERY":
      return { ...state, query: action.payload };

    case "START_PARSING":
      return {
        ...state,
        status: "parsing",
        errorMessage: null,
      };

    case "PARSE_SUCCESS": {
      const { experiment, missingFields, assumptions, readyToTest } = action.payload;
      const nextStage: Stage = missingFields.length > 0 ? "clarify" : "define";
      return {
        ...state,
        status: "idle",
        experiment,
        missingFields,
        assumptions,
        stage: nextStage,
        history: [
          { id: experiment.id, query: experiment.originalQuery, timestamp: new Date().toLocaleTimeString() },
          ...state.history.slice(0, 9),
        ],
      };
    }

    case "SET_CLARIFICATION_ANSWER":
      return {
        ...state,
        clarificationAnswers: {
          ...state.clarificationAnswers,
          [action.payload.key]: action.payload.value,
        },
      };

    case "APPLY_CLARIFICATIONS": {
      if (!state.experiment) return state;
      const merged = mergeClarificationAnswers(
        state.experiment,
        state.clarificationAnswers,
        state.missingFields,
        state.assumptions
      );
      return {
        ...state,
        experiment: merged.updatedExperiment,
        missingFields: merged.remainingMissingFields,
        assumptions: merged.updatedAssumptions,
        stage: "define",
      };
    }

    case "UPDATE_EXPERIMENT_FIELD": {
      if (!state.experiment) return state;
      return {
        ...state,
        experiment: {
          ...state.experiment,
          ...action.payload,
        },
      };
    }

    case "START_TESTING":
      return {
        ...state,
        status: "testing",
        errorMessage: null,
      };

    case "TEST_SUCCESS":
      return {
        ...state,
        status: "idle",
        result: action.payload,
        stage: "learn",
      };

    case "SET_ERROR":
      return {
        ...state,
        status: "error",
        errorMessage: action.payload,
      };

    case "CLEAR_ERROR":
      return { ...state, errorMessage: null, status: "idle" };

    case "RESET_WORKFLOW":
      return {
        ...initialState,
        history: state.history,
      };

    case "LOAD_SAVED_SESSION":
      return {
        ...state,
        experiment: action.payload.experiment,
        result: action.payload.result || null,
        stage: action.payload.result ? "learn" : "define",
        status: "idle",
        errorMessage: null,
      };

    default:
      return state;
  }
}

export const ResearchWorkbench: React.FC = () => {
  const [state, dispatch] = useReducer(researchReducer, initialState);

  // Compute highest reached stage for stage stepper navigation
  const maxReachedStage: Stage = useMemo(() => {
    if (state.result) return "learn";
    if (state.stage === "test") return "test";
    if (state.experiment) return "define";
    if (state.missingFields.length > 0) return "clarify";
    return "ask";
  }, [state.result, state.stage, state.experiment, state.missingFields]);

  // Handle Query Submission (Stage 1 -> 2 or 3)
  const handleQuerySubmit = useCallback(async (query: string) => {
    dispatch({ type: "SET_QUERY", payload: query });
    dispatch({ type: "START_PARSING" });

    try {
      const res = await fetch("/api/research/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status ${res.status}`);
      }

      const data = await res.json();
      dispatch({
        type: "PARSE_SUCCESS",
        payload: {
          experiment: data.experimentDraft,
          missingFields: data.missingFields || [],
          assumptions: data.assumptions || [],
          readyToTest: Boolean(data.readyToTest),
        },
      });
    } catch (err: any) {
      console.error("Error parsing market question:", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to parse market question. Please try again.",
      });
    }
  }, []);

  // Handle Clarification submission
  const handleApplyClarifications = useCallback(
    (answers: Record<string, string | number>) => {
      Object.entries(answers).forEach(([key, value]) => {
        dispatch({
          type: "SET_CLARIFICATION_ANSWER",
          payload: { key, value },
        });
      });
      dispatch({ type: "APPLY_CLARIFICATIONS" });
    },
    []
  );

  // Handle running the backtest (Stage 3/4 -> 5)
  const handleRunTest = useCallback(
    async (datasetSource: "nifty-historical" | "simulated-market" = "nifty-historical") => {
      if (!state.experiment) return;
      dispatch({ type: "START_TESTING" });

      try {
        const res = await fetch("/api/research/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experiment: state.experiment,
            datasetSource,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed with status ${res.status}`);
        }

        const resultData: BacktestResult = await res.json();
        dispatch({ type: "TEST_SUCCESS", payload: resultData });
      } catch (err: any) {
        console.error("Error executing backtest:", err);
        dispatch({
          type: "SET_ERROR",
          payload: err.message || "Backtest calculation failed. Please try again.",
        });
      }
    },
    [state.experiment]
  );

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-cyprus-950 text-white border-b border-cyprus-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EdgeLabLogo size="md" showText={true} />
          </div>

          <div className="flex items-center gap-3">
            {state.history.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-cyprus-200">
                <History className="w-3.5 h-3.5 text-cyprus-400" />
                <span>{state.history.length} session{state.history.length > 1 ? "s" : ""}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_WORKFLOW" })}
              className="text-xs bg-cyprus-900 hover:bg-cyprus-800 text-cyprus-100 px-3.5 py-1.5 rounded-lg border border-cyprus-700 transition-colors shadow-xs font-medium"
            >
              New Query
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Stage Progress Stepper with Workbench Header */}
        <div className="bg-white border border-sand-300 rounded-xl p-4 md:p-5 shadow-card space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyprus-50 text-cyprus-800 border border-cyprus-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyprus-400" />
                Research Workbench
              </span>
              <p className="text-xs font-medium text-slate-600">
                From market question to transparent evidence.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden md:block">
              5-Stage Structured Research Workflow
            </span>
          </div>

          <StageStepper
            currentStage={state.stage}
            onSelectStage={(st) => dispatch({ type: "SET_STAGE", payload: st })}
            maxReachedStage={maxReachedStage}
          />
        </div>

        {/* Global Error Banner */}
        {state.errorMessage && (
          <div
            role="alert"
            className="flex items-center justify-between p-4 bg-brick-50 border border-brick-200 text-brick-900 rounded-xl text-xs md:text-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brick-600 shrink-0" />
              <span>{state.errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: "CLEAR_ERROR" })}
              className="text-xs font-semibold text-brick-700 hover:text-brick-900 underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stage 1: ASK */}
        <div className={state.stage === "ask" ? "block" : "hidden"}>
          <ResearchPrompt
            initialQuery={state.query}
            onSubmit={handleQuerySubmit}
            isLoading={state.status === "parsing"}
          />
        </div>

        {/* Stage 2: CLARIFY */}
        {state.stage === "clarify" && state.experiment && (
          <div className="space-y-6">
            <ClarificationPanel
              missingFields={state.missingFields}
              assumptions={state.assumptions}
              experiment={state.experiment}
              onApplyClarifications={handleApplyClarifications}
              onSkipToDefine={() => dispatch({ type: "SET_STAGE", payload: "define" })}
            />
          </div>
        )}

        {/* Stage 3: DEFINE */}
        {state.stage === "define" && state.experiment && (
          <div className="space-y-6">
            <ExperimentCard
              experiment={state.experiment}
              onUpdateExperiment={(updates) =>
                dispatch({ type: "UPDATE_EXPERIMENT_FIELD", payload: updates })
              }
              onProceedToTest={() => dispatch({ type: "SET_STAGE", payload: "test" })}
            />
          </div>
        )}

        {/* Stage 4: TEST */}
        {state.stage === "test" && state.experiment && (
          <div className="space-y-6">
            <TestPanel
              experiment={state.experiment}
              onRunTest={handleRunTest}
              isLoading={state.status === "testing"}
            />
          </div>
        )}

        {/* Stage 5: LEARN */}
        {state.stage === "learn" && state.result && (
          <div className="space-y-6">
            <ResultSummary result={state.result} />
            <EvidenceVsConclusion learn={state.result.learn} />
            <NextQuestions
              questions={state.result.learn.nextQuestions}
              onSelectQuestion={(q) => handleQuerySubmit(q)}
              onResetWorkflow={() => dispatch({ type: "RESET_WORKFLOW" })}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sand-300 bg-white/70 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong>EdgeLab AI Selection Assignment</strong> — Designed for Transparent Ambiguity & Deterministic Research.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js App Router</span>
            <span>&bull;</span>
            <span>Google Gemini API</span>
            <span>&bull;</span>
            <span>Neon PostgreSQL</span>
            <span>&bull;</span>
            <span>Drizzle ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
