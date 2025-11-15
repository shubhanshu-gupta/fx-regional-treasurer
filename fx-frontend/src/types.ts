export interface FxEvent {
  category: string;
  headline: string;
  region: string;
  currencies: string[];
  source: string;
  source_date: string;
  url?: string | null;
  impact_statement: string;
}

export type ActionSeverity = 'none' | 'monitor' | 'evaluate_hedging';

export interface FxAction {
  severity: ActionSeverity;
  summary: string;
  currencies: string[];
}

export interface DailyReport {
  date: string;
  executive_summary: string;
  items: FxEvent[];
  actions: FxAction[];
}
