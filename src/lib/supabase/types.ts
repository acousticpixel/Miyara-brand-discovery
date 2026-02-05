// Database types for Supabase
// These match the schema defined in the migrations

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          status: 'active' | 'completed' | 'abandoned';
          current_phase:
            | 'OPENING'
            | 'RAPID_FIRE_INTRO'
            | 'RAPID_FIRE'
            | 'RAPID_FIRE_DEBRIEF'
            | 'DEEP_DIVE'
            | 'SCENARIO'
            | 'SYNTHESIS'
            | 'REFINEMENT'
            | 'COMPLETE';
          company_name: string | null;
          user_name: string | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'completed' | 'abandoned';
          current_phase?:
            | 'OPENING'
            | 'RAPID_FIRE_INTRO'
            | 'RAPID_FIRE'
            | 'RAPID_FIRE_DEBRIEF'
            | 'DEEP_DIVE'
            | 'SCENARIO'
            | 'SYNTHESIS'
            | 'REFINEMENT'
            | 'COMPLETE';
          company_name?: string | null;
          user_name?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'completed' | 'abandoned';
          current_phase?:
            | 'OPENING'
            | 'RAPID_FIRE_INTRO'
            | 'RAPID_FIRE'
            | 'RAPID_FIRE_DEBRIEF'
            | 'DEEP_DIVE'
            | 'SCENARIO'
            | 'SYNTHESIS'
            | 'REFINEMENT'
            | 'COMPLETE';
          company_name?: string | null;
          user_name?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
        };
      };
      conversation_messages: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          role: 'user' | 'assistant';
          content: string;
          response_data: Json | null;
          sequence_number: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          role: 'user' | 'assistant';
          content: string;
          response_data?: Json | null;
          sequence_number: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          created_at?: string;
          role?: 'user' | 'assistant';
          content?: string;
          response_data?: Json | null;
          sequence_number?: number;
        };
      };
      rapid_fire_responses: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          value_word: string;
          response: 'yes' | 'no' | 'maybe';
          response_time_ms: number | null;
          sequence_number: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          value_word: string;
          response: 'yes' | 'no' | 'maybe';
          response_time_ms?: number | null;
          sequence_number: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          created_at?: string;
          value_word?: string;
          response?: 'yes' | 'no' | 'maybe';
          response_time_ms?: number | null;
          sequence_number?: number;
        };
      };
      identified_values: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          updated_at: string;
          value_name: string;
          personalized_definition: string | null;
          in_practice: string | null;
          anti_pattern: string | null;
          user_quotes: Json;
          confidence_score: number;
          is_final: boolean;
          display_order: number | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          updated_at?: string;
          value_name: string;
          personalized_definition?: string | null;
          in_practice?: string | null;
          anti_pattern?: string | null;
          user_quotes?: Json;
          confidence_score?: number;
          is_final?: boolean;
          display_order?: number | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          created_at?: string;
          updated_at?: string;
          value_name?: string;
          personalized_definition?: string | null;
          in_practice?: string | null;
          anti_pattern?: string | null;
          user_quotes?: Json;
          confidence_score?: number;
          is_final?: boolean;
          display_order?: number | null;
        };
      };
      deliverables: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          content: Json;
          pdf_url: string | null;
          share_slug: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          content: Json;
          pdf_url?: string | null;
          share_slug?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          created_at?: string;
          content?: Json;
          pdf_url?: string | null;
          share_slug?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
