export type ModelId =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "claude-sonnet"
  | "gemini-1.5-pro"
  | "deepseek-chat";

export type UseCase =
  | "カスタマーサポート"
  | "翻訳"
  | "要約"
  | "文書分析"
  | "コード生成"
  | "社内ナレッジ検索"
  | "その他";

export interface CostInput {
  projectName: string;
  model: ModelId;
  monthlyRequests: number;
  averageInputTokens: number;
  averageOutputTokens: number;
  failureRate: number;
  averageRetries: number;
  useCase: UseCase;
  hasCache: boolean;
  hasRag: boolean;
  hasAgent: boolean;
}

export interface CostResult {
  baseCost: number;
  failedRequestCount: number;
  failedWaste: number;
  retryWaste: number;
  totalCost: number;
  totalWastePercentage: number;
  estimatedSavings: number;
  optimizedCost: number;
  successCount: number;
  retryCount: number;
}

export interface ModelPricing {
  label: string;
  inputPer1M: number;
  outputPer1M: number;
}
