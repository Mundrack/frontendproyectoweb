export interface Comparison {
  id: number;
  name: string;
  description: string;
  created_by: number;
  created_by_name: string;
  audit_count: number;
  created_at: string;
}

export interface CreateComparisonData {
  name: string;
  description: string;
  audit_ids: number[];
}

export interface ComparisonAnalysis {
  audits: Array<{
    id: number;
    title: string;
    score_percentage: number;
    score_by_category: Record<string, number>;
  }>;
  comparative_analysis: {
    same_template: boolean;
    total_audits: number;
    highest_score: {
      audit_id: number;
      score: number;
    };
    lowest_score: {
      audit_id: number;
      score: number;
    };
    average_score: number;
    score_range: number;
    score_variance: number;
  };
  categories_comparison?: Record<
    string,
    {
      audits: Array<{
        audit_id: number;
        percentage: number;
      }>;
      average: number;
      highest: number;
      lowest: number;
    }
  >;
}

export interface TrendsAnalysis {
  overall_trend: 'improving' | 'declining' | 'stable';
  change_percentage: number;
  scores_timeline: number[];
  categories_trends: Record<
    string,
    {
      scores: number[];
      trend: 'improving' | 'declining' | 'stable';
      change_percentage: number;
    }
  >;
  audits_count: number;
}
