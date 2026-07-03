import { MODEL_PRICING, resolveModelId } from "@/lib/pricing";

/** USD per 1M input tokens — aligned with tokenlens SDK PRICING. */
const TRACK_MODEL_INPUT_PRICE: Record<string, number> = {
  "claude-sonnet-4-6": 3.0,
  "claude-haiku-4-5": 0.8,
  "claude-sonnet-4-5": 3.0,
  "gpt-4.1": 2.0,
  "gpt-4.1-mini": 0.4,
  "gpt-4.1-nano": 0.1,
  "gpt-4o": 2.5,
  "gpt-4o-mini": 0.15,
  "deepseek-chat": 0.27,
};

export function getInputPricePer1M(model: string): number {
  const normalized = model.trim().toLowerCase();
  if (TRACK_MODEL_INPUT_PRICE[normalized] !== undefined) {
    return TRACK_MODEL_INPUT_PRICE[normalized];
  }

  const exact = Object.entries(TRACK_MODEL_INPUT_PRICE).find(
    ([key]) =>
      normalized === key ||
      normalized.startsWith(`${key}-`) ||
      normalized.includes(key)
  );
  if (exact) return exact[1];

  const modelId = resolveModelId(model);
  if (modelId) {
    return MODEL_PRICING[modelId].inputPer1M;
  }

  return 0;
}

/** cache_read_tokens * (input_price * 0.9 / 1_000_000) */
export function computeCacheSavings(
  model: string,
  cacheReadTokens: number,
  legacyCacheSaved?: number
): number {
  const tokens = Number(cacheReadTokens) || 0;
  if (tokens > 0) {
    const inputPrice = getInputPricePer1M(model);
    return tokens * ((inputPrice * 0.9) / 1_000_000);
  }
  return Number(legacyCacheSaved ?? 0);
}
