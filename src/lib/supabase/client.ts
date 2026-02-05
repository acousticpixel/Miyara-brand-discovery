// Browser Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Using untyped client to avoid type issues
// Types will be properly inferred when Supabase generates types from the schema
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabase;
