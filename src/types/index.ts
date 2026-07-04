export type ModelId =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "claude-sonnet"
  | "gemini-1.5-pro"
  | "deepseek-chat";

export interface ModelPricing {
  label: string;
  inputPer1M: number;
  outputPer1M: number;
}
