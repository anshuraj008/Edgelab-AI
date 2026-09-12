import { NextRequest, NextResponse } from "next/server";
import { TestExperimentRequestSchema } from "@/lib/schema/experiment";
import { runDeterministicBacktest } from "@/lib/research/backtest-engine";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getDb } from "@/lib/db";
import { testRuns, experiments } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 60, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Please retry in ${rateLimit.reset} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = TestExperimentRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid experiment configuration for backtesting",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { experiment, datasetSource } = parseResult.data;

    // Run deterministic calculation engine
    const result = runDeterministicBacktest({
      experiment,
      allowOverlap: false,
    });

    // Optional Neon DB persistence
    const db = getDb();
    if (db) {
      try {
        await db.insert(testRuns).values({
          id: `run_${Date.now()}`,
          experimentId: experiment.id,
          datasetSource,
          metricsJson: result.metrics,
          learnJson: result.learn,
          warningsJson: result.metrics.warnings,
        }).onConflictDoNothing();
      } catch (dbErr) {
        console.warn("Could not save test run to Neon DB:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API /api/research/test Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while executing the backtest." },
      { status: 500 }
    );
  }
}
