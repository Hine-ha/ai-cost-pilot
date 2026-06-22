import { formatPercent, formatUsd } from "@/lib/calculator";
import { MODEL_PRICING, resolveModelId } from "@/lib/pricing";
import { CsvDiagnosisResult, ModelCostBreakdown, ModelId } from "@/types";

const FAILED_STATUSES = new Set(["error", "failed", "failure", "fail"]);

function isFailedStatus(status: string): boolean {
  return FAILED_STATUSES.has(status.trim().toLowerCase());
}

function rowRequestCost(
  modelId: ModelId,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[modelId];
  return (
    (inputTokens / 1_000_000) * pricing.inputPer1M +
    (outputTokens / 1_000_000) * pricing.outputPer1M
  );
}

export function analyzeCsvRows(
  rows: Record<string, string>[]
): CsvDiagnosisResult {
  if (rows.length === 0) {
    throw new Error("CSVに有効なデータ行がありません。");
  }

  const unknownModels = new Set<string>();
  const modelCostMap = new Map<
    string,
    { modelId: ModelId | null; cost: number; requestCount: number }
  >();

  let totalRequests = 0;
  let successfulRequests = 0;
  let failedRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalRetries = 0;
  let totalLatencyMs = 0;
  let baseCost = 0;
  let failedRequestWaste = 0;
  let retryWaste = 0;

  for (const row of rows) {
    const modelRaw = row.model?.trim();
    if (!modelRaw) continue;

    const inputTokens = Number(row.input_tokens);
    const outputTokens = Number(row.output_tokens);
    const latencyMs = Number(row.latency_ms);
    const retries = Number(row.retries);

    if (
      !Number.isFinite(inputTokens) ||
      !Number.isFinite(outputTokens) ||
      inputTokens < 0 ||
      outputTokens < 0
    ) {
      continue;
    }

    const modelId = resolveModelId(modelRaw);
    if (!modelId) {
      unknownModels.add(modelRaw);
      continue;
    }

    totalRequests += 1;
    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;

    if (Number.isFinite(latencyMs) && latencyMs >= 0) {
      totalLatencyMs += latencyMs;
    }

    const retryCount = Number.isFinite(retries) && retries >= 0 ? retries : 0;
    totalRetries += retryCount;

    const requestCost = rowRequestCost(modelId, inputTokens, outputTokens);
    baseCost += requestCost;

    const failed = isFailedStatus(row.status ?? "");
    if (failed) {
      failedRequests += 1;
      failedRequestWaste += requestCost;
    } else {
      successfulRequests += 1;
    }

    retryWaste += requestCost * retryCount;

    const modelKey = modelId;
    const existing = modelCostMap.get(modelKey) ?? {
      modelId,
      cost: 0,
      requestCount: 0,
    };
    existing.cost += requestCost + requestCost * retryCount;
    existing.requestCount += 1;
    modelCostMap.set(modelKey, existing);
  }

  if (totalRequests === 0) {
    throw new Error(
      unknownModels.size > 0
        ? "登録済みモデルに一致する行がありません。モデル名を確認してください。"
        : "CSVに有効なデータ行がありません。"
    );
  }

  const totalCost = baseCost + retryWaste;
  const totalWaste = failedRequestWaste + retryWaste;
  const wasteRate = totalCost > 0 ? (totalWaste / totalCost) * 100 : 0;
  const estimatedSavings = totalCost * 0.25;
  const optimizedCost = totalCost - estimatedSavings;
  const failureRate = (failedRequests / totalRequests) * 100;
  const averageRetries =
    failedRequests > 0 ? totalRetries / failedRequests : 0;
  const averageLatencyMs = totalLatencyMs / totalRequests;

  const costByModel: ModelCostBreakdown[] = Array.from(modelCostMap.values())
    .map((entry) => ({
      modelId: entry.modelId,
      modelLabel: entry.modelId
        ? MODEL_PRICING[entry.modelId].label
        : "不明",
      requestCount: entry.requestCount,
      cost: entry.cost,
      sharePercent: totalCost > 0 ? (entry.cost / totalCost) * 100 : 0,
    }))
    .sort((a, b) => b.cost - a.cost);

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    failureRate,
    totalInputTokens,
    totalOutputTokens,
    averageInputTokens: totalInputTokens / totalRequests,
    averageOutputTokens: totalOutputTokens / totalRequests,
    totalRetries,
    averageRetries,
    averageLatencyMs,
    costByModel,
    totalCost,
    baseCost,
    failedRequestWaste,
    retryWaste,
    totalWaste,
    wasteRate,
    estimatedSavings,
    optimizedCost,
    unknownModels: Array.from(unknownModels),
    hasUnknownModels: unknownModels.size > 0,
    successCount: successfulRequests,
    failedRequestCount: failedRequests,
    retryCount: totalRetries,
    failedWaste: failedRequestWaste,
    totalWastePercentage: wasteRate,
  };
}

export function csvResultToCostResult(result: CsvDiagnosisResult) {
  return {
    baseCost: result.baseCost,
    failedRequestCount: result.failedRequestCount,
    failedWaste: result.failedRequestWaste,
    retryWaste: result.retryWaste,
    totalCost: result.totalCost,
    totalWastePercentage: result.wasteRate,
    estimatedSavings: result.estimatedSavings,
    optimizedCost: result.optimizedCost,
    successCount: result.successCount,
    retryCount: result.retryCount,
  };
}

export function generateCsvExecutiveSummary(
  projectName: string,
  result: CsvDiagnosisResult
): string {
  const topModel = result.costByModel[0]?.modelLabel ?? "不明";
  return (
    `「${projectName}」の CSV ログ診断結果、総リクエスト数 ${result.totalRequests.toLocaleString()} 件、` +
    `推定 API コストは ${formatUsd(result.totalCost)} です（主要モデル: ${topModel}）。` +
    `失敗リクエストと再試行に起因する推定無駄コストは ${formatUsd(result.totalWaste)}（無駄率 ${formatPercent(result.wasteRate)}）です。` +
    `適切な最適化施策を適用した場合、最大 ${formatUsd(result.estimatedSavings)} の削減が見込まれ、` +
    `最適化後のコストは ${formatUsd(result.optimizedCost)} 程度に抑えられる可能性があります。`
  );
}

export interface CsvReportRecommendation {
  title: string;
  description: string;
}

const EXPENSIVE_MODELS = new Set<ModelId>(["gpt-4.1", "claude-sonnet"]);

export function getCsvReportRecommendations(
  result: CsvDiagnosisResult
): CsvReportRecommendation[] {
  const recommendations: CsvReportRecommendation[] = [];

  if (result.failureRate > 5) {
    recommendations.push({
      title: "エラーハンドリングと構造化出力バリデーションの強化",
      description:
        "失敗率が 5% を超えています。JSON Schema による出力検証、リトライ前のエラー分類、タイムアウト設定の見直しで、失敗リクエストと再試行コストを削減してください。",
    });
  }

  if (result.totalRetries >= Math.max(3, result.failedRequests)) {
    recommendations.push({
      title: "再試行ポリシーの見直し",
      description:
        "再試行回数が多く、盲目的なリトライがコストを押し上げている可能性があります。指数バックオフ、最大再試行回数の上限、冪等性のない操作への再試行禁止を検討してください。",
    });
  }

  if (result.averageInputTokens >= 1500) {
    recommendations.push({
      title: "プロンプト圧縮と RAG コンテキスト上限の設定",
      description:
        "平均入力トークン数が高いです。プロンプトの冗長表現を削減し、RAG 取得チャンク数・最大コンテキスト長に上限を設けてください。",
    });
  }

  const topModelEntry = result.costByModel[0];
  if (
    topModelEntry &&
    topModelEntry.modelId &&
    EXPENSIVE_MODELS.has(topModelEntry.modelId) &&
    topModelEntry.sharePercent >= 50
  ) {
    recommendations.push({
      title: "モデルルーティングの導入",
      description: `${topModelEntry.modelLabel} がコストの ${formatPercent(topModelEntry.sharePercent)} を占めています。タスク難易度に応じて GPT-4.1 mini や DeepSeek Chat 等へルーティングし、品質を維持しつつコストを最適化してください。`,
    });
  }

  if (result.totalWaste >= result.totalCost * 0.15) {
    recommendations.push({
      title: "失敗リクエストのトレーシング",
      description:
        "失敗・再試行による無駄コストが高水準です。リクエスト ID によるトレース、失敗パターンの分類、根本原因分析を実施し、再発防止策を特定してください。",
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "トークン使用量の定期レビュー",
      description:
        "入出力トークン数を週次でモニタリングし、プロンプトテンプレートの冗長部分を継続的に削減してください。",
    });
  }

  return recommendations.slice(0, 5);
}

export function generateCsvWasteInsights(result: CsvDiagnosisResult) {
  const insights = [];

  if (result.failedRequests > 0) {
    insights.push({
      factor: "失敗リクエスト",
      impact: formatUsd(result.failedRequestWaste),
      detail: `失敗率 ${formatPercent(result.failureRate)} により、${result.failedRequests.toLocaleString()} 件の失敗が発生。失敗分の API 呼び出しは出力を得られず、入力トークンコストが無駄になります。`,
    });
  }

  if (result.totalRetries > 0) {
    insights.push({
      factor: "再試行",
      impact: formatUsd(result.retryWaste),
      detail: `合計 ${result.totalRetries.toLocaleString()} 回の再試行により、追加 API コストが発生しています（平均 ${result.averageRetries.toFixed(1)} 回 / 失敗リクエスト）。`,
    });
  }

  if (result.averageInputTokens >= 1500) {
    insights.push({
      factor: "長いプロンプト",
      impact: `${Math.round(result.averageInputTokens).toLocaleString()} tokens / req`,
      detail:
        "平均入力トークン数が多いほど、リクエスト単価が上昇します。プロンプトの冗長表現や不要なコンテキストを削減することで、基本コストを抑えられます。",
    });
  }

  if (insights.length === 0) {
    insights.push({
      factor: "現状",
      impact: "低リスク",
      detail:
        "重大な無駄要因は検出されませんでした。引き続き月次モニタリングを推奨します。",
    });
  }

  return insights;
}
