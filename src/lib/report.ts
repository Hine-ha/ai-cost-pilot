import { MODEL_PRICING } from "@/lib/pricing";
import { CostInput, CostResult, ModelId } from "@/types";
import { formatPercent, formatUsd } from "@/lib/calculator";

const EXPENSIVE_MODELS = new Set<ModelId>(["gpt-4.1", "claude-sonnet"]);

export interface ReportRecommendation {
  title: string;
  description: string;
}

export interface WasteInsight {
  factor: string;
  impact: string;
  detail: string;
}

export function isExpensiveModel(model: ModelId): boolean {
  return EXPENSIVE_MODELS.has(model);
}

export function generateExecutiveSummary(
  input: CostInput,
  result: CostResult
): string {
  const modelLabel = MODEL_PRICING[input.model].label;
  const totalWaste = result.failedWaste + result.retryWaste;
  const savingsRate =
    result.totalCost > 0
      ? (result.estimatedSavings / result.totalCost) * 100
      : 0;

  return (
    `「${input.projectName}」の診断結果、月間 AI API コストは ${formatUsd(result.totalCost)}（${modelLabel} / ${input.useCase}）です。` +
    `失敗リクエストと再試行に起因する推定無駄コストは ${formatUsd(totalWaste)}（無駄率 ${formatPercent(result.totalWastePercentage)}）です。` +
    `適切な最適化施策を適用した場合、最大 ${formatUsd(result.estimatedSavings)}（${formatPercent(savingsRate)}）の削減が見込まれ、` +
    `最適化後の月次コストは ${formatUsd(result.optimizedCost)} 程度に抑えられる可能性があります。`
  );
}

export function generateWasteInsights(
  input: CostInput,
  result: CostResult
): WasteInsight[] {
  const insights: WasteInsight[] = [];

  if (input.failureRate > 0) {
    insights.push({
      factor: "失敗リクエスト",
      impact: formatUsd(result.failedWaste),
      detail: `失敗率 ${formatPercent(input.failureRate)} により、月間 ${Math.round(result.failedRequestCount).toLocaleString()} 件の失敗が発生。失敗分の API 呼び出しは出力を得られず、入力トークンコストが無駄になります。`,
    });
  }

  if (input.averageRetries > 0 && result.retryWaste > 0) {
    insights.push({
      factor: "再試行",
      impact: formatUsd(result.retryWaste),
      detail: `平均 ${input.averageRetries} 回の再試行により、追加 API 呼び出しが ${Math.round(result.retryCount).toLocaleString()} 件発生。再試行追加コストは合計コスト（基本コスト + 再試行追加コスト）に加算されます。`,
    });
  }

  if (input.averageInputTokens >= 1500) {
    insights.push({
      factor: "長いプロンプト",
      impact: `${input.averageInputTokens.toLocaleString()} tokens / req`,
      detail:
        "平均入力トークン数が多いほど、リクエスト単価が上昇します。プロンプトの冗長表現や不要なコンテキストを削減することで、基本コストを抑えられます。",
    });
  }

  if (!input.hasCache) {
    insights.push({
      factor: "キャッシュ未導入",
      impact: "繰り返しクエリに脆弱",
      detail:
        "同一・類似リクエストごとに LLM を呼び出している可能性があります。セマンティックキャッシュにより、重複呼び出しを回避できます。",
    });
  }

  if (input.hasRag) {
    insights.push({
      factor: "RAG 構成",
      impact: "コンテキスト増加",
      detail:
        "検索結果をプロンプトに注入する RAG は入力トークンを増やします。取得チャンク数や最大コンテキスト長の上限設定が重要です。",
    });
  }

  if (input.hasAgent) {
    insights.push({
      factor: "Agent ワークフロー",
      impact: "多段 API 呼び出し",
      detail:
        "エージェントは推論・ツール呼び出し・再計画など複数ステップで API を消費します。各ステップのトレースがコスト可視化の前提となります。",
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

export function getReportRecommendations(
  input: CostInput
): ReportRecommendation[] {
  const recommendations: ReportRecommendation[] = [];

  if (input.failureRate > 5) {
    recommendations.push({
      title: "構造化出力バリデーションとタイムアウト制御の強化",
      description:
        "失敗率が 5% を超えています。JSON Schema による出力検証、リトライ前のエラー分類、タイムアウト設定の見直しで、失敗リクエストと再試行コストを削減してください。",
    });
  }

  if (!input.hasCache) {
    recommendations.push({
      title: "セマンティックキャッシュの導入",
      description:
        "類似クエリに対する LLM 呼び出しをキャッシュすることで、繰り返しリクエストのコストを大幅に削減できます。FAQ や定型的な問い合わせに特に有効です。",
    });
  }

  if (input.hasAgent) {
    recommendations.push({
      title: "Agent 各ステップのトレーシング",
      description:
        "エージェントワークフローの各ステップ（計画・ツール実行・再推論）をトレースし、不要な API 呼び出しやループを特定してください。",
    });
  }

  if (input.hasRag) {
    recommendations.push({
      title: "RAG 取得コンテキスト長の上限設定",
      description:
        "検索結果のチャンク数・最大トークン数を制限し、関連度スコアによるフィルタリングで、プロンプト肥大化を防いでください。",
    });
  }

  if (isExpensiveModel(input.model)) {
    recommendations.push({
      title: "モデルルーティングの導入",
      description: `${MODEL_PRICING[input.model].label} は高単価モデルです。タスク難易度に応じて GPT-4.1 mini や DeepSeek Chat 等へルーティングし、品質を維持しつつコストを最適化してください。`,
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "トークン使用量の定期レビュー",
      description:
        "平均入出力トークン数を週次でモニタリングし、プロンプトテンプレートの冗長部分を継続的に削減してください。",
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "失敗率・再試行率のダッシュボード化",
      description:
        "API 失敗率と再試行回数を可視化し、閾値超過時にアラートを設定することで、コスト異常の早期検知が可能になります。",
    });
  }

  return recommendations.slice(0, 5);
}
