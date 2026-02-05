// Session types matching database schema

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export type SessionPhase =
  | 'OPENING'
  | 'RAPID_FIRE_INTRO'
  | 'RAPID_FIRE'
  | 'RAPID_FIRE_DEBRIEF'
  | 'DEEP_DIVE'
  | 'SCENARIO'
  | 'SYNTHESIS'
  | 'REFINEMENT'
  | 'COMPLETE';

export interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  status: SessionStatus;
  current_phase: SessionPhase;
  company_name?: string;
  user_name?: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  created_at: string;
  role: 'user' | 'assistant';
  content: string;
  response_data?: AgentResponse;
  sequence_number: number;
}

export interface RapidFireResponse {
  id: string;
  session_id: string;
  created_at: string;
  value_word: string;
  response: 'yes' | 'no' | 'maybe';
  response_time_ms?: number;
  sequence_number: number;
}

export interface IdentifiedValue {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  value_name: string;
  personalized_definition?: string;
  in_practice?: string;
  anti_pattern?: string;
  user_quotes: string[];
  confidence_score: number;
  is_final: boolean;
  display_order?: number;
}

export interface Deliverable {
  id: string;
  session_id: string;
  created_at: string;
  content: DeliverableContent;
  pdf_url?: string;
  share_slug?: string;
}

export interface DeliverableContent {
  company_name: string;
  generated_at: string;
  values: IdentifiedValue[];
  session_summary?: string;
}

// Import AgentResponse from agent types
import type { AgentResponse } from './agent';
