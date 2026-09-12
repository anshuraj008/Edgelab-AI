import { NextRequest, NextResponse } from "next/server";
import { ParseQueryRequestSchema } from "@/lib/schema/experiment";
import { parseMarketQuestion } from "@/lib/ai/parse-question";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getDb } from "@/lib/db";
import { researchSessions, experiments } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting by IP or Client Header
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 40, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Please retry in ${rateLimit.reset} seconds.` },
        { status: 429 }
      );
    }

    // 2. Input validation
    const body = await req.json();
    const parseResult = ParseQueryRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { query, clarifications } = parseResult.data;

    // 3. AI Parsing & Structuring
    const structuredResult = await parseMarketQuestion(query, clarifications);

    // 4. Optional Persistence to Neon DB
    const db = getDb();
    if (db) {
      try {
        await db.insert(researchSessions).values({
          id: structuredResult.experimentDraft.id,
          originalQuestion: query,
          status: structuredResult.readyToTest ? "clarified" : "draft",
        }).onConflictDoNothing();

        await db.insert(experiments).values({
          id: structuredResult.experimentDraft.id,
          sessionId: structuredResult.experimentDraft.id,
          instrument: structuredResult.experimentDraft.instrument.value,
          timeframe: structuredResult.experimentDraft.timeframe.value,
          entryCondition: JSON.stringify(structuredResult.experimentDraft.entryCondition.value),
          exitCondition: JSON.stringify(structuredResult.experimentDraft.exitCondition.value),
          holdingPeriod: String(structuredResult.experimentDraft.holdingPeriodDays.value),
          testPeriod: JSON.stringify(structuredResult.experimentDraft.testPeriod.value),
          filtersJson: structuredResult.experimentDraft.filters,
          costsJson: structuredResult.experimentDraft.costs.value,
          hypothesis: structuredResult.experimentDraft.hypothesis,
          provenanceJson: {
            instrument: structuredResult.experimentDraft.instrument,
            entryCondition: structuredResult.experimentDraft.entryCondition,
            holdingPeriodDays: structuredResult.experimentDraft.holdingPeriodDays,
            testPeriod: structuredResult.experimentDraft.testPeriod,
            costs: structuredResult.experimentDraft.costs,
          },
        }).onConflictDoNothing();
      } catch (dbErr) {
        console.warn("Could not save to Neon DB:", dbErr);
      }
    }

    return NextResponse.json(structuredResult);
  } catch (err: any) {
    console.error("API /api/research/parse Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while parsing the market research query." },
      { status: 500 }
    );
  }
}
