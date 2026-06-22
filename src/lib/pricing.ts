import { ModelId, ModelPricing } from "@/types";

export const MODEL_OPTIONS: { value: ModelId; label: string }[] = [
  { value: "gpt-4.1", label: "GPT-4.1（OpenAI）" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 ミニ（OpenAI）" },
  { value: "claude-sonnet", label: "Claude Sonnet（Anthropic）" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro（Google）" },
  { value: "deepseek-chat", label: "DeepSeek Chat（DeepSeek）" },
];

export const MODEL_PRICING: Record<ModelId, ModelPricing> = {
  "gpt-4.1": {
    label: "GPT-4.1",
    inputPer1M: 2.0,
    outputPer1M: 8.0,
  },
  "gpt-4.1-mini": {
    label: "GPT-4.1 mini",
    inputPer1M: 0.4,
    outputPer1M: 1.6,
  },
  "claude-sonnet": {
    label: "Claude Sonnet",
    inputPer1M: 3.0,
    outputPer1M: 15.0,
  },
  "gemini-1.5-pro": {
    label: "Gemini 1.5 Pro",
    inputPer1M: 1.25,
    outputPer1M: 5.0,
  },
  "deepseek-chat": {
    label: "DeepSeek Chat",
    inputPer1M: 0.14,
    outputPer1M: 0.28,
  },
};

export const USE_CASE_OPTIONS = [
  "カスタマーサポート",
  "翻訳",
  "要約",
  "文書分析",
  "コード生成",
  "社内ナレッジ検索",
  "その他",
] as const;

const MODEL_ALIASES: Record<string, ModelId> = {
  "gpt-4.1": "gpt-4.1",
  "gpt-4.1（openai）": "gpt-4.1",
  "gpt-4.1 mini": "gpt-4.1-mini",
  "gpt-4.1-mini": "gpt-4.1-mini",
  "gpt-4.1 ミニ": "gpt-4.1-mini",
  "gpt-4.1 ミニ（openai）": "gpt-4.1-mini",
  "claude sonnet": "claude-sonnet",
  "claude-sonnet": "claude-sonnet",
  "claude sonnet（anthropic）": "claude-sonnet",
  "gemini 1.5 pro": "gemini-1.5-pro",
  "gemini-1.5-pro": "gemini-1.5-pro",
  "gemini 1.5 pro（google）": "gemini-1.5-pro",
  "deepseek chat": "deepseek-chat",
  "deepseek-chat": "deepseek-chat",
  "deepseek chat（deepseek）": "deepseek-chat",
};

export function resolveModelId(rawModel: string): ModelId | null {
  const normalized = rawModel.trim().toLowerCase();
  if (MODEL_ALIASES[normalized]) {
    return MODEL_ALIASES[normalized];
  }

  const byLabel = MODEL_OPTIONS.find(
    (option) => option.label.toLowerCase() === normalized
  );
  if (byLabel) return byLabel.value;

  const byPricing = (Object.entries(MODEL_PRICING) as [ModelId, ModelPricing][]).find(
    ([, pricing]) => pricing.label.toLowerCase() === normalized
  );
  return byPricing ? byPricing[0] : null;
}
