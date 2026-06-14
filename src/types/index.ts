export type ModelId =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "claude-sonnet"
  | "gemini-1.5-pro"
  | "deepseek-chat";

export type UseCase =
  | "Customer Support"
  | "Translation"
  | "Summarization"
  | "Document Analysis"
  | "Code Generation"
  | "Internal Knowledge Base"
  | "Other";

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
