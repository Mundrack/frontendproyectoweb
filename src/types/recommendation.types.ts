export interface Recommendation {
  id: number;
  audit: number;
  audit_title: string;
  category: string;
  recommendation_text: string;
  priority: 'high' | 'medium' | 'low';
  is_auto_generated: boolean;
  created_by: number | null;
  created_at: string;
}

export interface CreateRecommendationData {
  audit: number;
  category: string;
  recommendation_text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationsSummary {
  total: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  auto_generated: number;
  manual: number;
}
