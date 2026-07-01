import {
  DailyCostPoint,
  DashboardResponse,
  DashboardStats,
  ModelUsageBreakdown,
  ProjectUsageSummary,
  UsageEventRow,
} from "@/types/usage";

const FAILED_STATUSES = new Set(["error", "failed", "failure", "fail"]);

function isFailedStatus(status: string | undefined): boolean {
  if (!status) return false;
  return FAILED_STATUSES.has(status.trim().toLowerCase());
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildDailyCostTrend(rows: UsageEventRow[]): DailyCostPoint[] {
  const now = new Date();
  const dailyMap = new Map<string, number>();

  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setUTCDate(day.getUTCDate() - i);
    dailyMap.set(formatDateKey(day), 0);
  }

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  for (const row of rows) {
    const ts = new Date(row.timestamp);
    if (ts < thirtyDaysAgo) continue;
    const key = formatDateKey(ts);
    if (!dailyMap.has(key)) {
      dailyMap.set(key, 0);
    }
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + Number(row.cost));
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({ date, cost }));
}

function buildModelBreakdown(rows: UsageEventRow[]): ModelUsageBreakdown[] {
  const modelMap = new Map<string, ModelUsageBreakdown>();

  for (const row of rows) {
    const existing = modelMap.get(row.model) ?? {
      model: row.model,
      request_count: 0,
      input_tokens: 0,
      output_tokens: 0,
      cost: 0,
    };

    existing.request_count += 1;
    existing.input_tokens += row.input_tokens;
    existing.output_tokens += row.output_tokens;
    existing.cost += Number(row.cost);
    modelMap.set(row.model, existing);
  }

  return Array.from(modelMap.values()).sort((a, b) => b.cost - a.cost);
}

function buildDashboardStats(rows: UsageEventRow[]): DashboardStats {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  let monthlyTotalCost = 0;
  let failedCount = 0;
  let cacheSavings = 0;

  for (const row of rows) {
    const ts = new Date(row.timestamp);
    const cost = Number(row.cost);

    if (ts >= monthStart) {
      monthlyTotalCost += cost;
    }

    if (isFailedStatus(row.status)) {
      failedCount += 1;
    }

    cacheSavings += Number(row.cache_saved ?? 0);
  }

  const totalRequests = rows.length;
  const failureRate =
    totalRequests > 0 ? (failedCount / totalRequests) * 100 : 0;

  return {
    monthly_total_cost: monthlyTotalCost,
    total_requests: totalRequests,
    failure_rate: failureRate,
    cache_savings: cacheSavings,
  };
}

export function aggregateUsageByProject(
  rows: UsageEventRow[]
): Pick<DashboardResponse, "projects" | "summary"> {
  const projectMap = new Map<string, ProjectUsageSummary>();

  for (const row of rows) {
    const existing = projectMap.get(row.project_name) ?? {
      project_name: row.project_name,
      request_count: 0,
      total_input_tokens: 0,
      total_output_tokens: 0,
      total_tokens: 0,
      total_cost: 0,
      last_event_at: null,
      models: [],
    };

    existing.request_count += 1;
    existing.total_input_tokens += row.input_tokens;
    existing.total_output_tokens += row.output_tokens;
    existing.total_tokens += row.input_tokens + row.output_tokens;
    existing.total_cost += Number(row.cost);

    if (!existing.models.includes(row.model)) {
      existing.models.push(row.model);
    }

    if (
      !existing.last_event_at ||
      new Date(row.timestamp).getTime() >
        new Date(existing.last_event_at).getTime()
    ) {
      existing.last_event_at = row.timestamp;
    }

    projectMap.set(row.project_name, existing);
  }

  const projects = Array.from(projectMap.values()).sort(
    (a, b) => b.total_cost - a.total_cost
  );

  const summary = projects.reduce(
    (acc, project) => {
      acc.project_count += 1;
      acc.request_count += project.request_count;
      acc.total_input_tokens += project.total_input_tokens;
      acc.total_output_tokens += project.total_output_tokens;
      acc.total_tokens += project.total_tokens;
      acc.total_cost += project.total_cost;
      return acc;
    },
    {
      project_count: 0,
      request_count: 0,
      total_input_tokens: 0,
      total_output_tokens: 0,
      total_tokens: 0,
      total_cost: 0,
    }
  );

  return { projects, summary };
}

export function buildDashboardResponse(
  rows: UsageEventRow[]
): Omit<DashboardResponse, "available_projects" | "selected_project"> {
  const base = aggregateUsageByProject(rows);

  return {
    ...base,
    stats: buildDashboardStats(rows),
    daily_cost_trend: buildDailyCostTrend(rows),
    model_breakdown: buildModelBreakdown(rows),
  };
}
