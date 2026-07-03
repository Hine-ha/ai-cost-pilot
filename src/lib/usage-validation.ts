import { TrackUsagePayload } from "@/types/usage";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidTimestamp(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

export function parseTrackUsagePayload(
  body: unknown
): { ok: true; data: TrackUsagePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const payload = body as Record<string, unknown>;

  if (!isNonEmptyString(payload.project_name)) {
    return { ok: false, error: "project_name is required." };
  }

  if (!isNonEmptyString(payload.model)) {
    return { ok: false, error: "model is required." };
  }

  if (!isNonNegativeNumber(payload.input_tokens)) {
    return { ok: false, error: "input_tokens must be a non-negative number." };
  }

  if (!isNonNegativeNumber(payload.output_tokens)) {
    return { ok: false, error: "output_tokens must be a non-negative number." };
  }

  if (!isNonNegativeNumber(payload.cost)) {
    return { ok: false, error: "cost must be a non-negative number." };
  }

  if (!isValidTimestamp(payload.timestamp)) {
    return { ok: false, error: "timestamp must be a valid ISO date string." };
  }

  const user_id = isNonEmptyString(payload.user_id)
    ? payload.user_id.trim()
    : undefined;

  const cache_read_tokens = isNonNegativeNumber(payload.cache_read_tokens)
    ? Math.floor(payload.cache_read_tokens)
    : 0;
  const cache_write_tokens = isNonNegativeNumber(payload.cache_write_tokens)
    ? Math.floor(payload.cache_write_tokens)
    : 0;

  return {
    ok: true,
    data: {
      project_name: payload.project_name.trim(),
      model: payload.model.trim(),
      input_tokens: payload.input_tokens,
      output_tokens: payload.output_tokens,
      cost: payload.cost,
      timestamp: new Date(payload.timestamp).toISOString(),
      cache_read_tokens,
      cache_write_tokens,
      ...(user_id && { user_id }),
      ...(isNonEmptyString(payload.status) && {
        status: payload.status.trim().toLowerCase(),
      }),
      ...(isNonNegativeNumber(payload.cache_saved) && {
        cache_saved: payload.cache_saved,
      }),
      ...(isNonEmptyString(payload.provider) && {
        provider: payload.provider.trim(),
      }),
      ...(isNonNegativeNumber(payload.latency_ms) && {
        latency_ms: Math.floor(payload.latency_ms),
      }),
      ...(isNonEmptyString(payload.use_case) && {
        use_case: payload.use_case.trim(),
      }),
      ...(typeof payload.success === "boolean" && {
        success: payload.success,
      }),
      ...(isNonEmptyString(payload.error_type) && {
        error_type: payload.error_type.trim(),
      }),
    },
  };
}
