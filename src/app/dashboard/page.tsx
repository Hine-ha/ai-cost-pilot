"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import SdkConfigPanel from "@/components/dashboard/SdkConfigPanel";
import {
  formatPercent,
  formatUsdAdaptive,
  getChartCostDomain,
} from "@/lib/calculator";
import {
  DashboardLocale,
  getDashboardMessages,
} from "@/lib/i18n/dashboard";
import { DashboardResponse } from "@/types/usage";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LOCALE_LABELS: Record<DashboardLocale, string> = {
  zh: "中文",
  ja: "日本語",
};

function LanguageSwitcher({
  locale,
  onChange,
}: {
  locale: DashboardLocale;
  onChange: (locale: DashboardLocale) => void;
}) {
  const t = getDashboardMessages(locale);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500">{t.language}</span>
      <div
        className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1"
        role="group"
        aria-label={t.language}
      >
        {(["zh", "ja"] as const).map((lang) => {
          const active = locale === lang;
          return (
            <button
              key={lang}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(lang)}
              className={`min-w-[72px] rounded-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {LOCALE_LABELS[lang]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectFilter({
  label,
  allProjectsLabel,
  projects,
  value,
  onChange,
}: {
  label: string;
  allProjectsLabel: string;
  projects: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="project-filter"
        className="text-xs font-medium text-gray-500"
      >
        {label}
      </label>
      <select
        id="project-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[200px] rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="all">{allProjectsLabel}</option>
        {projects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>
    </div>
  );
}

function detectDefaultLocale(): DashboardLocale {
  if (typeof navigator === "undefined") return "ja";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "ja";
}

export default function DashboardPage() {
  const [locale, setLocale] = useState<DashboardLocale>("ja");
  const [selectedProject, setSelectedProject] = useState("all");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useMemo(() => getDashboardMessages(locale), [locale]);

  useEffect(() => {
    setLocale(detectDefaultLocale());
  }, []);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const query =
        selectedProject !== "all"
          ? `?project=${encodeURIComponent(selectedProject)}`
          : "";
      const response = await fetch(`/api/dashboard${query}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as DashboardResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? t.loadError);
      }

      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadError);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, t.loadError]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const chartData = useMemo(
    () =>
      (data?.daily_cost_trend ?? []).map((point) => ({
        ...point,
        label: point.date.slice(5),
      })),
    [data]
  );

  const chartCosts = useMemo(
    () => chartData.map((point) => point.cost),
    [chartData]
  );

  const yDomain = useMemo(() => getChartCostDomain(chartCosts), [chartCosts]);

  const hasChartData = chartCosts.some((cost) => cost > 0);
  const projectOptions = data?.available_projects ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 pb-20 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="mt-2 text-gray-600">{t.subtitle}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {!isLoading && projectOptions.length > 0 && (
              <ProjectFilter
                label={t.projectFilter}
                allProjectsLabel={t.allProjects}
                projects={projectOptions}
                value={selectedProject}
                onChange={setSelectedProject}
              />
            )}
            <LanguageSwitcher locale={locale} onChange={setLocale} />
          </div>
        </div>

        <SdkConfigPanel t={t} />

        {isLoading && <DashboardSkeleton />}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label={t.monthlyCost}
                value={formatUsdAdaptive(data.stats.monthly_total_cost)}
                subtext={t.usd}
              />
              <StatCard
                label={t.totalRequests}
                value={data.stats.total_requests.toLocaleString()}
              />
              <StatCard
                label={t.failureRate}
                value={formatPercent(data.stats.failure_rate)}
                accent={
                  data.stats.failure_rate > 5 ? "danger" : "default"
                }
              />
              <StatCard
                label={t.cacheSavings}
                value={formatUsdAdaptive(data.stats.cache_savings)}
                subtext={t.usd}
                accent="success"
              />
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                {t.dailyTrend}
              </h2>
              <div className="mt-6 h-72 min-h-[288px] w-full">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        domain={yDomain}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        width={72}
                        tickFormatter={(value: number) =>
                          formatUsdAdaptive(value)
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatUsdAdaptive(Number(value ?? 0)),
                          t.cost,
                        ]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
                    {t.emptyChart}
                  </div>
                )}
              </div>
            </section>

            <section
              id="model-breakdown"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {t.modelBreakdown}
              </h2>
              <div className="mt-6 overflow-x-auto">
                {data.model_breakdown.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-3 font-medium">{t.model}</th>
                        <th className="px-4 py-3 font-medium">{t.requests}</th>
                        <th className="px-4 py-3 font-medium">
                          {t.inputTokens}
                        </th>
                        <th className="px-4 py-3 font-medium">
                          {t.outputTokens}
                        </th>
                        <th className="px-4 py-3 font-medium">{t.cost}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {data.model_breakdown.map((row) => (
                        <tr key={row.model} className="text-gray-900">
                          <td className="px-4 py-3 font-medium">{row.model}</td>
                          <td className="px-4 py-3">
                            {row.request_count.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {row.input_tokens.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {row.output_tokens.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {formatUsdAdaptive(row.cost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                    {t.emptyTable}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
