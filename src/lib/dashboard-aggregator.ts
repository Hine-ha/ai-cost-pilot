import { DashboardResponse, ProjectUsageSummary, UsageEventRow } from "@/types/usage";

export function aggregateUsageByProject(
  rows: UsageEventRow[]
): DashboardResponse {
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
