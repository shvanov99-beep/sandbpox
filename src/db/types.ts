export type TriggerType = '3_months' | '6_months' | '12_months' | 'ad_hoc';

export interface Decision {
  id: string;
  action: string;
  context: string;
  alternatives: string;
  main_argument: string;
  expect_3m: string;
  expect_6m: string;
  expect_12m: string;
  confidence: number;         // 1..10
  emotional_state: string;
  created_at: number;         // unix ms
}

export interface Review {
  id: string;
  decision_id: string;
  review_date: number;
  trigger_type: TriggerType;
  what_happened?: string;
  actual_outcome_score?: number;  // 1..10
  luck_factor?: number;           // 1..5 (1 = pure skill, 5 = pure luck)
  ad_hoc_thoughts?: string;
  created_at: number;
}

export interface Tag {
  id: string;
  name: string;       // unique, case-insensitive
  created_at: number;
}

export interface DecisionTag {
  decision_id: string;
  tag_id: string;
}
