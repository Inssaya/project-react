import dotenv from 'dotenv';

dotenv.config();

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET', 'PORT'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn('Missing env vars:', missing.join(', '));
}

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  PORT: process.env.PORT || 3001,
};

export default env;
