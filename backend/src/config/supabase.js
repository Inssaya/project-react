import { createClient } from '@supabase/supabase-js';
import env from './env.js';

/**
 * Supabase client singleton used by models/services.
 * Uses the anon key from env; do not expose service role here.
 */
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

let serviceClient = null;
export const getServiceSupabase = () => {
  if (!serviceClient && env.SUPABASE_SERVICE_ROLE_KEY) {
    serviceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return serviceClient;
};

export default supabase;
