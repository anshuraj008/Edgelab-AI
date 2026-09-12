import { pgTable, text, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

export const researchSessions = pgTable("research_sessions", {
  id: text("id").primaryKey(),
  originalQuestion: text("original_question").notNull(),
  status: text("status").notNull().default("draft"), // draft | clarified | tested
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const experiments = pgTable("experiments", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => researchSessions.id, { onDelete: "cascade" }),
  instrument: text("instrument").notNull(),
  timeframe: text("timeframe").notNull().default("daily"),
  entryCondition: text("entry_condition").notNull(),
  exitCondition: text("exit_condition").notNull(),
  holdingPeriod: text("holding_period").notNull(),
  testPeriod: text("test_period").notNull(),
  filtersJson: jsonb("filters_json").default([]),
  costsJson: jsonb("costs_json").notNull(),
  hypothesis: text("hypothesis").notNull(),
  provenanceJson: jsonb("provenance_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testRuns = pgTable("test_runs", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id").references(() => experiments.id, { onDelete: "cascade" }),
  datasetSource: text("dataset_source").notNull(),
  metricsJson: jsonb("metrics_json").notNull(),
  learnJson: jsonb("learn_json").notNull(),
  warningsJson: jsonb("warnings_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
