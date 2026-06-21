export interface ElderProfile {
  name: string;
  age: number;
  living_alone?: boolean;
  has_history?: boolean;
}

export interface BaselineData {
  avg_sleep_time: string;
  avg_wake_time: string;
  avg_night_exits: number;
  avg_exit_duration_min: number;
  abnormal_impact_count_30d: number;
}

export interface TodayData {
  sleep_time: string;
  wake_time: string;
  night_exits: number;
  max_exit_duration_min: number;
  abnormal_impact: boolean;
  [key: string]: any;
}

export interface DayData {
  date: string;
  sleep_time: string;
  wake_time: string;
  night_exits: number;
  max_exit_duration_min: number;
}

export interface WeekData {
  elder_profile: ElderProfile;
  week_data: DayData[];
  last_week_score: number;
}

export interface AnomalyAnalysis {
  is_abnormal: boolean;
  abnormal_score: number;
  abnormal_points: Array<{
    metric: string;
    baseline: string;
    today: string;
    deviation: string;
  }>;
  natural_language_summary: string;
  recommended_action: '继续观察' | '建议关注' | '建议联系';
  confidence: number;
}

export interface WeeklyReport {
  overall_score: number;
  score_change: string;
  summary_sentence: string;
  key_findings: string[];
  actionable_suggestions: string[];
  risk_level: 'green' | 'yellow' | 'red';
  warm_closing: string;
}

export interface ThinkingStep {
  step: number;
  title: string;
  reasoning: string;
  conclusion: string;
}

export interface EmergencyDecision {
  thinking_steps: ThinkingStep[];
  final_decision: {
    confidence: number;
    response_level: number;
    level_name: string;
    actions: string[];
    natural_language_alert: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SensorEvent {
  type: string;
  impact_force?: number;
  timestamp: string;
  location?: string;
  post_event_activity?: string;
  [key: string]: any;
}

export interface MockData {
  baseline: any;
  todayNormal: TodayData & { elder_profile: ElderProfile };
  todayAbnormal: TodayData & { elder_profile: ElderProfile };
  week: WeekData;
  emergencyEvents: any[];
}