import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import * as authModel from './auth.model.js';
import supabase from '../../config/supabase.js';
import { getServiceSupabase } from '../../config/supabase.js';

/**
 * Register a new user: hashes password and inserts into users table.
 */
export const register = async ({ email, password, full_name, role }) => {
  const existing = await authModel.findByEmail(email);
  if (existing.error) throw existing.error;
  if (existing.data) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  // If a service role key is available, create a Supabase Auth user and link profile
  const service = getServiceSupabase();
  let created = { data: null, error: null };
  if (service) {
    try {
      const { data: authData, error: authErr } = await service.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name },
      });
      if (authErr) {
        created.error = authErr;
      } else {
        // Insert profile linked to auth user
        const profilePayload = { auth_user_id: authData.user.id, role };
        const { data: profileData, error: profileErr } = await supabase.from('profiles').insert([profilePayload]).select().maybeSingle();
        if (profileErr) {
          created.error = profileErr;
        } else {
          created.data = { id: authData.user.id, email: authData.user.email, full_name, role };
        }
      }
    } catch (err) {
      created.error = err;
    }
  } else {
    const hash = await bcrypt.hash(password, 10);
    const payload = { email, password_hash: hash, full_name, role };
    created = await authModel.createUser(payload);
  }
  // If Supabase returned an error, surface it
  if (created.error) {
    console.error('Supabase createUser error:', created.error);
    const err = new Error(created.error.message || 'Failed to create user');
    err.status = created.error.status || 400;
    err.details = created.error.details || created.error;
    throw err;
  }

  // If no data was returned, it's often due to Row Level Security (RLS) or permission policies
  if (!created.data) {
    console.error('Supabase createUser returned no data. Raw result:', created);
    const err = new Error('Failed to create user: no rows returned. This may be caused by Supabase Row-Level Security (RLS) or insufficient permissions for the anon key.');
    err.status = 500;
    err.details = 'No rows returned from insert. Check Supabase table policies for `users` or use a service role key for server-side operations.';
    throw err;
  }

  // If using non-service flow we already created profile in createUser path; if service flow, profile created above.

  return created.data;
};

// After creating a user in `users` table, also create a profile row to link roles
export const createProfileForUser = async (userId, role, major_id = null, class_id = null) => {
  const payload = { auth_user_id: userId, role, major_id, class_id };
  const { data, error } = await supabase.from('profiles').insert([payload]).select().maybeSingle();
  if (error) {
    console.error('Failed to create profile for user', error);
    const err = new Error('Failed to create profile for user');
    err.status = 500;
    throw err;
  }
  return data;
};

/**
 * Login: verifies password and returns JWT
 */
export const login = async ({ email, password }) => {
  const found = await authModel.findByEmail(email);
  if (found.error) throw found.error;
  if (!found.data) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, found.data.password_hash || '');
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ sub: found.data.id, role: found.data.role }, env.JWT_SECRET, { expiresIn: '7d' });
  return { user: found.data, token };
};

export default { register, login };
