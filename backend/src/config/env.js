import dotenv from 'dotenv';

dotenv.config();

const required = ['SUPABASE_URL', 'JWT_SECRET', 'PORT'];
const recommended = ['SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((k) => !process.env[k]);
const missingRecommended = recommended.filter((k) => !process.env[k]);

if (missing.length) {
  console.warn('❌ Missing required env vars:', missing.join(', '));
}
if (missingRecommended.length) {
  console.warn('⚠️  Missing recommended env vars:', missingRecommended.join(', '));
}

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  PORT: process.env.PORT || 3001,
};

export default env;
