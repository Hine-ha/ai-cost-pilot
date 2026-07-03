import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { computeCacheSavings } from "@/lib/usage-pricing";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { parseTrackUsagePayload } from "@/lib/usage-validation";

export const dynamic = "force-dynamic";

function verifyApiKey(request: NextRequest): boolean {
  const expected = process.env.TOKENLENS_API_KEY?.trim();
  if (!expected) return false;
  const provided = request.headers.get("x-api-key")?.trim();
  return provided === expected;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.TOKENLENS_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Server misconfigured: TOKENLENS_API_KEY is not set." },
        { status: 503 }
      );
    }

    if (!verifyApiKey(request)) {
      return NextResponse.json({ error: "Invalid or missing x-api-key." }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const parsed = parseTrackUsagePayload(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    let eventData = parsed.data;
    if (!eventData.user_id) {
      const { userId } = auth();
      if (userId) {
        eventData = { ...eventData, user_id: userId };
      }
    }

    const cacheSaved = computeCacheSavings(
      eventData.model,
      eventData.cache_read_tokens ?? 0,
      eventData.cache_saved
    );
    eventData = { ...eventData, cache_saved: cacheSaved };

    const supabase = getSupabaseAdmin();
    let data = null;
    let error: { message?: string; hint?: string } | null = null;

    const fullInsert = await supabase
      .from("usage_events")
      .insert(eventData)
      .select(
        [
          "id",
          "project_name",
          "model",
          "input_tokens",
          "output_tokens",
          "cost",
          "timestamp",
          "user_id",
          "created_at",
          "cache_read_tokens",
          "cache_write_tokens",
          "cache_saved",
        ].join(", ")
      )
      .single();

    data = fullInsert.data;
    error = fullInsert.error;

    if (error?.message?.includes("cache_read_tokens")) {
      const legacy = { ...eventData };
      delete legacy.cache_read_tokens;
      delete legacy.cache_write_tokens;
      const legacyInsert = await supabase
        .from("usage_events")
        .insert({ ...legacy, cache_saved: cacheSaved })
        .select(
          "id, project_name, model, input_tokens, output_tokens, cost, timestamp, user_id, created_at, cache_saved"
        )
        .single();
      data = legacyInsert.data;
      error = legacyInsert.error;
    }

    if (error) {
      console.error("[POST /api/track]", error);
      return NextResponse.json(
        {
          error: "Failed to save usage event.",
          ...(process.env.NODE_ENV === "development" && {
            detail: error.message,
            hint: error.hint,
          }),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, event: data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/track]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    const status = message.includes("Missing NEXT_PUBLIC_SUPABASE_URL")
      ? 503
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
