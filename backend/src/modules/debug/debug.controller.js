import supabase from '../../config/supabase.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { error as errorResponse, success } from '../../utils/response.js';

// Attempts to insert a row into users (for debugging RLS/policy issues)
export const supabaseTest = asyncHandler(async (req, res) => {
  const payload = req.body || {
    email: `debug+${Date.now()}@example.com`,
    password_hash: 'test',
    first_name: 'Debug',
    last_name: 'User',
    role: 'student',
  };

  // Try insert and return raw Supabase response for debugging
  const result = await supabase.from('users').insert([payload]).select().maybeSingle();
  if (result.error) {
    return errorResponse(res, 'Supabase returned error', 500, result.error);
  }
  return success(res, result.data, 'Insert succeeded', 201);
});

export default { supabaseTest };
