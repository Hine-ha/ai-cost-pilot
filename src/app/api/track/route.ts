import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { parseTrackUsagePayload } from "@/lib/usage-validation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
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

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("usage_events")
      .insert(parsed.data)
      .select("id, project_name, model, input_tokens, output_tokens, cost, timestamp, created_at")
      .single();

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
