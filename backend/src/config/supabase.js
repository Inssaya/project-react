import { createClient } from '@supabase/supabase-js';
import env from './env.js';

/**
 * Supabase client singleton used by models/services.
 * Uses SERVICE_ROLE key for backend operations (bypasses RLS).
 * Authorization is handled at Express middleware layer.
 * Falls back to anon key if service_role not configured.
 */
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - using anon key (RLS will apply)');
}

const supabase = createClient(env.SUPABASE_URL, supabaseKey, {
  auth: { persistSession: false },
});

export default supabase;
