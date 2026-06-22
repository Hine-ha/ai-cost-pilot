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

export interface ModelCostBreakdown {
  modelId: ModelId | null;
  modelLabel: string;
  requestCount: number;
  cost: number;
  sharePercent: number;
}

export interface CsvDiagnosisResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  failureRate: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  averageInputTokens: number;
  averageOutputTokens: number;
  totalRetries: number;
  averageRetries: number;
  averageLatencyMs: number;
  costByModel: ModelCostBreakdown[];
  totalCost: number;
  baseCost: number;
  failedRequestWaste: number;
  retryWaste: number;
  totalWaste: number;
  wasteRate: number;
  estimatedSavings: number;
  optimizedCost: number;
  unknownModels: string[];
  hasUnknownModels: boolean;
  successCount: number;
  failedRequestCount: number;
  retryCount: number;
  failedWaste: number;
  totalWastePercentage: number;
}

export type DiagnosisMode = "manual" | "csv";

export interface ManualDiagnosisSession {
  mode: "manual";
  input: CostInput;
}

export interface CsvDiagnosisSession {
  mode: "csv";
  projectName: string;
  result: CsvDiagnosisResult;
}

export type DiagnosisSession = ManualDiagnosisSession | CsvDiagnosisSession;

export interface ModelPricing {
  label: string;
  inputPer1M: number;
  outputPer1M: number;
}
