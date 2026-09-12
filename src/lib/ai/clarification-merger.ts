import { Experiment, MissingField, Assumption } from "@/types/research";

/**
 * Deterministic clarification merger.
 * Merges user clarification answers into the Experiment draft without losing provenance
 * or overwriting user-confirmed fields with AI hallucinations.
 */
export function mergeClarificationAnswers(
  currentExperiment: Experiment,
  clarifications: Record<string, string | number>,
  currentMissingFields: MissingField[],
  currentAssumptions: Assumption[]
): {
  updatedExperiment: Experiment;
  remainingMissingFields: MissingField[];
  updatedAssumptions: Assumption[];
  readyToTest: boolean;
} {
  const exp: Experiment = JSON.parse(JSON.stringify(currentExperiment));

  // Merge holding period
  if (clarifications.holdingPeriodDays !== undefined) {
    const days = Number(clarifications.holdingPeriodDays);
    if (!isNaN(days) && days > 0) {
      exp.holdingPeriodDays = {
        value: days,
        source: "clarified",
        confidence: 1.0,
        userEdited: true,
      };
      exp.exitCondition = {
        value: {
          type: "time_exit",
          holdingDays: days,
          description: `Exit position after ${days} trading sessions`,
        },
        source: "clarified",
        confidence: 1.0,
        userEdited: true,
      };
    }
  }

  // Merge entry threshold
  if (clarifications.entryCondition !== undefined || clarifications.thresholdPct !== undefined) {
    const rawVal = clarifications.entryCondition ?? clarifications.thresholdPct;
    let threshold = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal));
    if (!isNaN(threshold)) {
      if (threshold > 0) threshold = -threshold; // Ensure drop is negative
      exp.entryCondition = {
        value: {
          type: "daily_return_drop",
          thresholdPct: threshold,
          description: `Daily close falls by ${Math.abs(threshold)}% or more`,
        },
        source: "clarified",
        confidence: 1.0,
        userEdited: true,
      };
    }
  }

  // Merge test period
  if (clarifications.testPeriod !== undefined) {
    const periodStr = String(clarifications.testPeriod);
    if (periodStr.includes("to")) {
      const parts = periodStr.split("to").map((s) => s.trim());
      if (parts.length === 2) {
        exp.testPeriod = {
          value: { start: parts[0], end: parts[1] },
          source: "clarified",
          confidence: 1.0,
          userEdited: true,
        };
      }
    } else if (periodStr === "10y" || periodStr === "10 years") {
      exp.testPeriod = {
        value: { start: "2015-01-01", end: "2024-12-31" },
        source: "clarified",
        confidence: 1.0,
        userEdited: true,
      };
    } else if (periodStr === "5y" || periodStr === "5 years") {
      exp.testPeriod = {
        value: { start: "2020-01-01", end: "2024-12-31" },
        source: "clarified",
        confidence: 1.0,
        userEdited: true,
      };
    }
  }

  // Merge costs / slippage
  if (clarifications.transactionBps !== undefined || clarifications.slippageBps !== undefined) {
    const txBps =
      clarifications.transactionBps !== undefined
        ? Number(clarifications.transactionBps)
        : exp.costs.value.transactionBps;
    const slipBps =
      clarifications.slippageBps !== undefined
        ? Number(clarifications.slippageBps)
        : exp.costs.value.slippageBps;

    exp.costs = {
      value: {
        transactionBps: isNaN(txBps) ? 10 : txBps,
        slippageBps: isNaN(slipBps) ? 5 : slipBps,
      },
      source: "clarified",
      confidence: 1.0,
      userEdited: true,
    };
  }

  // Filter out resolved missing fields
  const answeredKeys = Object.keys(clarifications);
  const remainingMissingFields = currentMissingFields.filter(
    (field) => !answeredKeys.includes(field.key) && !(field.key === "entryCondition" && answeredKeys.includes("thresholdPct"))
  );

  // Ready to test if all required parameters have defined values
  const hasInstrument = Boolean(exp.instrument?.value);
  const hasEntryCondition = Boolean(exp.entryCondition?.value?.thresholdPct);
  const hasHoldingPeriod = Boolean(exp.holdingPeriodDays?.value && exp.holdingPeriodDays.value > 0);
  const hasTestPeriod = Boolean(exp.testPeriod?.value?.start && exp.testPeriod?.value?.end);

  const readyToTest = hasInstrument && hasEntryCondition && hasHoldingPeriod && hasTestPeriod && remainingMissingFields.length === 0;

  if (readyToTest) {
    exp.status = "clarified";
  }

  return {
    updatedExperiment: exp,
    remainingMissingFields,
    updatedAssumptions: currentAssumptions,
    readyToTest,
  };
}
