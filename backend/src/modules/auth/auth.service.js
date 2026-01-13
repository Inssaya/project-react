import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import supabase from '../../config/supabase.js';
import * as authModel from './auth.model.js';

/**
 * Register a new user: hashes password and inserts into users table.
 */
export const register = async ({ email, password, first_name, last_name, role }) => {
  const existing = await authModel.findByEmail(email);
  if (existing.error) throw existing.error;
  if (existing.data) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  // Hash password and create user in database
  const hash = await bcrypt.hash(password, 10);
  const payload = { email, password_hash: hash, first_name, last_name, role };
  const created = await authModel.createUser(payload);
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

  // Return user data with computed full_name for frontend convenience
  const userData = {
    ...created.data,
    full_name: `${created.data.first_name} ${created.data.last_name}`.trim(),
  };
  delete userData.password_hash; // Don't expose password hash

  return userData;
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
  
  // Return user data with computed full_name for frontend convenience
  const userData = {
    id: found.data.id,
    email: found.data.email,
    first_name: found.data.first_name,
    last_name: found.data.last_name,
    full_name: `${found.data.first_name} ${found.data.last_name}`.trim(),
    role: found.data.role,
    is_active: found.data.is_active,
  };

  // If user is a school admin, get their school_id
  if (found.data.role === 'school') {
    const { data: school } = await supabase
      .from('schools')
      .select('id, school_name')
      .eq('user_id', found.data.id)
      .maybeSingle();
    
    if (school) {
      userData.school_id = school.id;
      userData.school_name = school.school_name;
    }
  }

  // If user is a teacher, get their school_id
  if (found.data.role === 'teacher') {
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id, school_id')
      .eq('user_id', found.data.id)
      .maybeSingle();
    
    if (teacher) {
      userData.teacher_id = teacher.id;
      userData.school_id = teacher.school_id;
    }
  }

  // If user is a student, get their school_id and class_id
  if (found.data.role === 'student') {
    const { data: student } = await supabase
      .from('students')
      .select('id, school_id, class_id, major_id')
      .eq('user_id', found.data.id)
      .maybeSingle();
    
    if (student) {
      userData.student_id = student.id;
      userData.school_id = student.school_id;
      userData.class_id = student.class_id;
      userData.major_id = student.major_id;
    }
  }

  return { user: userData, token };
};

export default { register, login };
