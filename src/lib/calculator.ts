import { MODEL_PRICING } from "@/lib/pricing";
import { CostInput, CostResult } from "@/types";

function costPerRequest(
  averageInputTokens: number,
  averageOutputTokens: number,
  inputPrice: number,
  outputPrice: number
): number {
  return (
    (averageInputTokens / 1_000_000) * inputPrice +
    (averageOutputTokens / 1_000_000) * outputPrice
  );
}

export function calculateCost(input: CostInput): CostResult {
  const pricing = MODEL_PRICING[input.model];
  const failureRate = input.failureRate / 100;
  const requestCost = costPerRequest(
    input.averageInputTokens,
    input.averageOutputTokens,
    pricing.inputPer1M,
    pricing.outputPer1M
  );

  const baseCost = input.monthlyRequests * requestCost;
  const failedRequestCount = input.monthlyRequests * failureRate;
  const failedWaste = failedRequestCount * requestCost;
  const retryWaste = failedWaste * input.averageRetries;
  const totalCost = baseCost + retryWaste;

  const estimatedSavings = totalCost * 0.25;
  const optimizedCost = totalCost - estimatedSavings;

  const totalWaste = failedWaste + retryWaste;
  const totalWastePercentage =
    totalCost > 0 ? (totalWaste / totalCost) * 100 : 0;

  const retryCount = failedRequestCount * input.averageRetries;
  const successCount = input.monthlyRequests - failedRequestCount;

  return {
    baseCost,
    failedRequestCount,
    failedWaste,
    retryWaste,
    totalCost,
    totalWastePercentage,
    estimatedSavings,
    optimizedCost,
    successCount,
    retryCount,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUsdAdaptive(amount: number): string {
  const abs = Math.abs(amount);
  const digits =
    abs === 0 ? 2 : abs < 0.0001 ? 6 : abs < 0.01 ? 4 : abs < 1 ? 3 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function getChartCostDomain(costs: number[]): [number, number] {
  const values = costs.filter((cost) => cost > 0);
  if (values.length === 0) return [0, 0.001];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const padding = Math.max(max * 0.25, 0.0001);
    return [Math.max(0, min - padding), max + padding];
  }

  const padding = Math.max((max - min) * 0.15, 0.0001);
  return [Math.max(0, min - padding), max + padding];
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
