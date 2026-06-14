"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import StatCard from "@/components/StatCard";
import {
  calculateCost,
  formatPercent,
  formatUsd,
} from "@/lib/calculator";
import { MODEL_PRICING } from "@/lib/pricing";
import {
  generateExecutiveSummary,
  generateWasteInsights,
  getReportRecommendations,
} from "@/lib/report";
import { loadCostInput } from "@/lib/storage";
import { CostInput, CostResult } from "@/types";

function ReportSection({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="report-section rounded-2xl border border-gray-200 bg-white shadow-sm print:rounded-none print:shadow-none">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            {number}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

function BreakdownRow({
  label,
  amount,
  percentage,
  note,
  accent = "default",
}: {
  label: string;
  amount: string;
  percentage?: string;
  note?: string;
  accent?: "default" | "danger" | "success";
}) {
  const amountColor = {
    default: "text-gray-900",
    danger: "text-red-700",
    success: "text-emerald-700",
  }[accent];

  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-4 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {note && <p className="mt-1 text-sm text-gray-500">{note}</p>}
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${amountColor}`}>{amount}</p>
        {percentage && (
          <p className="text-sm text-gray-500">{percentage}</p>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState<CostInput | null>(null);
  const [result, setResult] = useState<CostResult | null>(null);

  useEffect(() => {
    try {
      const saved = loadCostInput();
      if (saved) {
        setInput(saved);
        setResult(calculateCost(saved));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reportDate = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    []
  );

  const executiveSummary = useMemo(
    () =>
      input && result ? generateExecutiveSummary(input, result) : "",
    [input, result]
  );

  const wasteInsights = useMemo(
    () => (input && result ? generateWasteInsights(input, result) : []),
    [input, result]
  );

  const recommendations = useMemo(
    () => (input ? getReportRecommendations(input) : []),
    [input]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-20 text-center text-gray-500">
          診断結果を読み込み中...
        </main>
      </div>
    );
  }

  if (!input || !result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="text-gray-600">
            診断データが見つかりません。もう一度診断してください。
          </p>
          <Link
            href="/diagnose"
            className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            診断を始める
          </Link>
        </main>
      </div>
    );
  }

  const modelLabel = MODEL_PRICING[input.model].label;
  const { totalCost, baseCost, retryWaste, failedWaste, optimizedCost } =
    result;
  const totalWasteCost = failedWaste + retryWaste;
  const savingsRate =
    totalCost > 0 ? (result.estimatedSavings / totalCost) * 100 : 0;
  const baseCostShare =
    totalCost > 0 ? (baseCost / totalCost) * 100 : 0;
  const retryCostShare =
    totalCost > 0 ? (retryWaste / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="report-print-area mx-auto max-w-6xl px-4 py-12 sm:px-6 print:max-w-none print:px-0 print:py-0">
        {/* Report Header */}
        <div className="report-section mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 print:shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
                AI Cost Diagnosis Report
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {input.projectName}
              </h1>
              <p className="mt-2 text-sm text-gray-500">診断日: {reportDate}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {modelLabel}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {input.useCase}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  月間 {input.monthlyRequests.toLocaleString()} req
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                PDFレポートを出力
              </button>
              <Link
                href="/diagnose"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                入力を修正する
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="現行月次コスト"
            value={formatUsd(totalCost)}
            subtext="Current Monthly Cost"
          />
          <StatCard
            label="推定無駄コスト"
            value={formatUsd(totalWasteCost)}
            subtext={`無駄率 ${formatPercent(result.totalWastePercentage)}`}
            accent="danger"
          />
          <StatCard
            label="推定削減可能額"
            value={formatUsd(result.estimatedSavings)}
            subtext={`削減率 ${formatPercent(savingsRate)}`}
            accent="success"
          />
          <StatCard
            label="最適化後コスト"
            value={formatUsd(optimizedCost)}
            subtext="Optimized Scenario"
            accent="success"
          />
        </div>

        <div className="space-y-8">
          {/* 1. Executive Summary */}
          <ReportSection
            number="01"
            title="エグゼクティブサマリー"
            subtitle="Executive Summary"
          >
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
              <p className="leading-relaxed text-gray-800">
                {executiveSummary}
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-gray-500">現行月次コスト</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatUsd(totalCost)}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-red-600">推定無駄</p>
                <p className="mt-1 text-lg font-bold text-red-700">
                  {formatUsd(totalWasteCost)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-emerald-600">削減可能額</p>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {formatUsd(result.estimatedSavings)}
                </p>
              </div>
            </div>
          </ReportSection>

          {/* 2. Cost Breakdown */}
          <ReportSection
            number="02"
            title="コスト内訳"
            subtitle="Cost Breakdown"
          >
            <BreakdownRow
              label="基本コスト"
              amount={formatUsd(baseCost)}
              percentage={`構成比 ${formatPercent(baseCostShare)}`}
              note="正常リクエストに対する API 利用料"
            />
            <BreakdownRow
              label="失敗リクエスト無駄"
              amount={formatUsd(failedWaste)}
              note="失敗した呼び出しに起因する分析上の無駄コスト"
              accent="danger"
            />
            <BreakdownRow
              label="再試行無駄"
              amount={formatUsd(retryWaste)}
              percentage={`構成比 ${formatPercent(retryCostShare)}`}
              note="再試行による追加 API コスト（月次コストに加算）"
              accent="danger"
            />
            <BreakdownRow
              label="最適化後コスト"
              amount={formatUsd(optimizedCost)}
              percentage={`削減率 ${formatPercent(savingsRate)}`}
              note="最適化施策適用後の試算シナリオ"
              accent="success"
            />

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="mb-4 text-sm font-medium text-gray-700">
                月次コスト構成（合計 100%）
              </p>
              <div className="space-y-4">
                <ProgressBar
                  label="基本コスト"
                  amount={formatUsd(baseCost)}
                  percentage={baseCostShare}
                  color="indigo"
                />
                <ProgressBar
                  label="再試行コスト"
                  amount={formatUsd(retryWaste)}
                  percentage={retryCostShare}
                  color="amber"
                />
              </div>
            </div>
          </ReportSection>

          {/* 3. Waste Analysis */}
          <ReportSection
            number="03"
            title="無駄コスト分析"
            subtitle="Waste Analysis — 独立分析指標"
          >
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <MetricRow label="合計無駄コスト" value={formatUsd(totalWasteCost)} accent="danger" />
              <MetricRow
                label="合計無駄率"
                value={formatPercent(result.totalWastePercentage)}
              />
            </div>
            <div className="space-y-4">
              {wasteInsights.map((insight) => (
                <div
                  key={insight.factor}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {insight.factor}
                    </h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                      影響: {insight.impact}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {insight.detail}
                  </p>
                </div>
              ))}
            </div>
          </ReportSection>

          {/* 4. Recommendations */}
          <ReportSection
            number="04"
            title="推奨アクション"
            subtitle="Recommendations"
          >
            <ol className="space-y-4">
              {recommendations.map((rec, index) => (
                <li
                  key={rec.title}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {rec.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </ReportSection>
        </div>

        {/* Appendix: Request Stats */}
        <div className="mt-8">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
            付録: リクエスト統計
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="成功リクエスト"
              value={Math.round(result.successCount).toLocaleString()}
              subtext="件 / 月"
            />
            <StatCard
              label="失敗リクエスト"
              value={Math.round(result.failedRequestCount).toLocaleString()}
              subtext="件 / 月"
              accent="danger"
            />
            <StatCard
              label="再試行回数"
              value={Math.round(result.retryCount).toLocaleString()}
              subtext="件 / 月"
              accent="danger"
            />
          </div>
        </div>

        <footer className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          本レポートは入力データに基づく試算です。実際の請求額はプロバイダー設定・割引・為替等により異なる場合があります。
        </footer>
      </main>
    </div>
  );
}

function MetricRow({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string;
  accent?: "default" | "danger";
}) {
  const valueColor = accent === "danger" ? "text-red-700" : "text-gray-900";

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <span className={`font-bold ${valueColor}`}>{value}</span>
    </div>
  );
}
