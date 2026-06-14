import { CostInput, ModelId } from "@/types";
import { MODEL_OPTIONS, USE_CASE_OPTIONS } from "@/lib/pricing";

export const DIAGNOSIS_STORAGE_KEY = "ai-cost-pilot-input";

const MODEL_IDS = new Set(MODEL_OPTIONS.map((option) => option.value));
const USE_CASES = new Set<string>(USE_CASE_OPTIONS);

const LEGACY_USE_CASE_MAP: Record<string, CostInput["useCase"]> = {
  "Customer Support": "カスタマーサポート",
  Translation: "翻訳",
  Summarization: "要約",
  "Document Analysis": "文書分析",
  "Code Generation": "コード生成",
  "Internal Knowledge Base": "社内ナレッジ検索",
  Other: "その他",
};

function normalizeUseCase(value: unknown): CostInput["useCase"] | null {
  if (typeof value !== "string") return null;
  if (USE_CASES.has(value)) return value as CostInput["useCase"];
  return LEGACY_USE_CASE_MAP[value] ?? null;
}

export function isValidCostInput(value: unknown): value is CostInput {
  if (!value || typeof value !== "object") return false;

  const input = value as Record<string, unknown>;

  return (
    typeof input.projectName === "string" &&
    input.projectName.trim().length > 0 &&
    typeof input.model === "string" &&
    MODEL_IDS.has(input.model as ModelId) &&
    typeof input.monthlyRequests === "number" &&
    input.monthlyRequests > 0 &&
    typeof input.averageInputTokens === "number" &&
    input.averageInputTokens > 0 &&
    typeof input.averageOutputTokens === "number" &&
    input.averageOutputTokens > 0 &&
    typeof input.failureRate === "number" &&
    input.failureRate >= 0 &&
    input.failureRate <= 100 &&
    typeof input.averageRetries === "number" &&
    input.averageRetries >= 0 &&
    normalizeUseCase(input.useCase) !== null &&
    typeof input.hasCache === "boolean" &&
    typeof input.hasRag === "boolean" &&
    typeof input.hasAgent === "boolean"
  );
}

export function saveCostInput(input: CostInput): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(input));
}

export function loadCostInput(): CostInput | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(DIAGNOSIS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const useCase = normalizeUseCase(parsed.useCase);
    if (!isValidCostInput(parsed) || !useCase) return null;

    return { ...(parsed as CostInput), useCase };
  } catch {
    return null;
  }
}
