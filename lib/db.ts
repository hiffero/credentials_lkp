import { createClient } from '@supabase/supabase-js';

// Server-only client. Never import this file into a Client Component.
let client: ReturnType<typeof createClient> | undefined;

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error('SUPABASE_URL dan SUPABASE_SECRET_KEY harus diatur pada environment variables.');
  }
  if (!client) {
    client = createClient(url, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
