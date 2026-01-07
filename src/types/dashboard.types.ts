export interface DashboardStats {
  total_audits: number;
  completed_audits: number;
  in_progress_audits: number;
  draft_audits: number;
  cancelled_audits: number;
  completion_rate: number;
  average_score: number;
  total_companies: number;
  total_employees: number;
}

export interface AuditByStatus {
  status: string;
  count: number;
}

export interface AuditByMonth {
  month: string;
  count: number;
  average_score: number;
}

export interface TopCompany {
  company_id: number;
  company_name: string;
  audits_count: number;
  average_score: number;
}

export interface RecentAudit {
  id: number;
  title: string;
  company_name: string;
  status: string;
  score_percentage: number | null;
  created_at: string;
}

export interface CategoryPerformance {
  category: string;
  average_score: number;
  audits_count: number;
}

export interface DashboardFilters {
  company_id?: number;
  start_date?: string;
  end_date?: string;
}
