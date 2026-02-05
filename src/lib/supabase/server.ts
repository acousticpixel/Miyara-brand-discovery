// Server-side Supabase client with service role
import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars aren't set
let _supabaseServer: SupabaseClientType | null = null;

function getSupabaseServer(): SupabaseClientType {
  if (_supabaseServer) {
    return _supabaseServer;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  _supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseServer;
}

// Export a proxy that lazily initializes the client
export const supabaseServer = new Proxy({} as SupabaseClientType, {
  get(_target, prop) {
    const client = getSupabaseServer();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export type SupabaseServerClient = typeof supabaseServer;
