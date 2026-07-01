export interface TrackUsagePayload {
  project_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  timestamp: string;
  status?: string;
  cache_saved?: number;
}

export interface UsageEventRow {
  id: string;
  project_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  timestamp: string;
  created_at: string;
  status?: string;
  cache_saved?: number;
}

export interface ProjectUsageSummary {
  project_name: string;
  request_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost: number;
  last_event_at: string | null;
  models: string[];
}

export interface DashboardStats {
  monthly_total_cost: number;
  total_requests: number;
  failure_rate: number;
  cache_savings: number;
}

export interface DailyCostPoint {
  date: string;
  cost: number;
}

export interface ModelUsageBreakdown {
  model: string;
  request_count: number;
  input_tokens: number;
  output_tokens: number;
  cost: number;
}

export interface DashboardResponse {
  projects: ProjectUsageSummary[];
  summary: {
    project_count: number;
    request_count: number;
    total_input_tokens: number;
    total_output_tokens: number;
    total_tokens: number;
    total_cost: number;
  };
  stats: DashboardStats;
  daily_cost_trend: DailyCostPoint[];
  model_breakdown: ModelUsageBreakdown[];
  available_projects: string[];
  selected_project: string | null;
}
