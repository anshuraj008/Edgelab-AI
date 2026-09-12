import { z } from "zod";

export const ProvenanceSourceSchema = z.enum(["user", "assumption", "clarified", "derived"]);

export const ProvenanceItemSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema,
    source: ProvenanceSourceSchema,
    confidence: z.number().min(0).max(1).optional(),
    reason: z.string().optional(),
    userEdited: z.boolean().optional(),
  });

export const MissingFieldSchema = z.object({
  key: z.enum([
    "instrument",
    "entryCondition",
    "holdingPeriodDays",
    "testPeriod",
    "transactionBps",
    "slippageBps",
  ]),
  question: z.string().min(3),
  whyImportant: z.string().min(5),
  suggestedValue: z.union([z.string(), z.number()]),
  type: z.enum(["string", "number", "select", "daterange"]),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),
});

export const AssumptionSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number()]),
  reason: z.string(),
  riskIfIncorrect: z.string(),
});

export const FilterConditionSchema = z.object({
  name: z.string(),
  value: z.string(),
  enabled: z.boolean().default(true),
});

export const ExperimentSchema = z.object({
  id: z.string().default(() => `exp_${Date.now()}`),
  originalQuery: z.string().min(1),
  instrument: ProvenanceItemSchema(z.string().min(1)),
  timeframe: ProvenanceItemSchema(z.enum(["daily", "hourly"])),
  entryCondition: ProvenanceItemSchema(
    z.object({
      type: z.string().default("daily_return_drop"),
      thresholdPct: z.number().max(0), // Negative percentage, e.g. -1.0
      description: z.string(),
    })
  ),
  exitCondition: ProvenanceItemSchema(
    z.object({
      type: z.enum(["time_exit", "stop_or_target"]).default("time_exit"),
      holdingDays: z.number().int().min(1).max(252),
      description: z.string(),
    })
  ),
  holdingPeriodDays: ProvenanceItemSchema(z.number().int().min(1).max(252)),
  testPeriod: ProvenanceItemSchema(
    z.object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  costs: ProvenanceItemSchema(
    z.object({
      transactionBps: z.number().min(0).max(500),
      slippageBps: z.number().min(0).max(500),
    })
  ),
  filters: z.array(FilterConditionSchema).default([]),
  hypothesis: z.string().min(5),
  status: z.enum(["draft", "clarified", "tested"]).default("draft"),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export const ParseQueryRequestSchema = z.object({
  query: z.string().min(3).max(2000),
  clarifications: z.record(z.union([z.string(), z.number()])).optional(),
});

export const AIParseResponseSchema = z.object({
  experimentDraft: ExperimentSchema,
  missingFields: z.array(MissingFieldSchema),
  assumptions: z.array(AssumptionSchema),
  readyToTest: z.boolean(),
});

export const TestExperimentRequestSchema = z.object({
  experiment: ExperimentSchema,
  datasetSource: z.enum(["nifty-historical", "simulated-market"]).default("nifty-historical"),
});
