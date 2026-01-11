export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at: string;
  question_count?: number;
}

export interface TemplateQuestion {
  id: number;
  template: number; // Changed from template_id to match serializer
  question_text: string;
  category: string;
  max_score: number; // Changed from weight
  order_num: number; // Changed from order_index
  is_required: boolean;
  help_text?: string;
}

export interface TemplateWithQuestions extends Template {
  questions: TemplateQuestion[];
}

export interface CreateTemplateData {
  name: string;
  iso_standard: string;
  description?: string;
  is_active?: boolean;
}

export type AuditStatus = 'draft' | 'in_progress' | 'completed';
export type ResponseType = 'yes' | 'no' | 'partial' | 'na';

export interface Audit {
  id: number;
  title: string;
  description: string;
  template_id: number;
  template_name: string;
  company_id: number;
  company_name: string;
  branch_id?: number;
  branch_name?: string;
  department_id?: number;
  department_name?: string;
  assigned_to_id?: number;
  assigned_to_name?: string;
  status: AuditStatus;
  scheduled_date?: string;
  completed_date?: string;
  score?: number;
  max_score?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAuditData {
  title: string;
  notes?: string;
  template: number;
  company: number;
  branch?: number;
  assigned_to?: number;
  scheduled_date?: string;
}

export interface QuestionWithResponse {
  id: number;
  audit_id: number;
  question_id: number;
  question_text: string;
  category: string;
  weight: number;
  order_index: number;
  response?: ResponseType;
  comments?: string;
  has_response: boolean;
}

export interface CreateResponseData {
  question_id: number;
  response: ResponseType;
  comments?: string;
}

export interface AuditSummary {
  total_questions: number;
  answered: number;
  yes: number;
  no: number;
  partial: number;
  na: number;
}

export interface ResponseDetail {
  question_text: string;
  category: string;
  response: ResponseType;
  comments?: string;
  score: number;
  max_score: number;
}

export interface AuditReport {
  audit: Audit;
  summary: AuditSummary;
  responses: ResponseDetail[];
  score_by_category: Record<string, { score: number; max_score: number }>;
}

export interface CategoryScore {
  score: number;
  max_score: number;
  percentage: number;
  question_count: number;
}

export interface ScoreBreakdown {
  total_score: number;
  max_score: number;
  percentage: number;
  categories: Record<string, CategoryScore>;
}
