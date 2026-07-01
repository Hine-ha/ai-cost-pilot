export interface TrackUsagePayload {
  project_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  timestamp: string;
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
}
