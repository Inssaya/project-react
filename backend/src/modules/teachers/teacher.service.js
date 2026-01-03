import bcrypt from 'bcrypt';
import supabase from '../../config/supabase.js';
import * as model from './teacher.model.js';

/**
 * Create a teacher WITH user authentication account
 * This creates both user and teacher records ATOMICALLY
 * Uses transaction-like logic with rollback on failure
 */
export const createTeacher = async (payload) => {
  let createdUserId = null;
  
  try {
    const { email, password, first_name, last_name, phone_number, school_id } = payload;
    
    // Validate required fields
    if (!email || !password || !first_name || !last_name || !school_id) {
      const error = new Error('Missing required fields: email, password, first_name, last_name, school_id are required');
      error.status = 400;
      error.details = { required: ['email', 'password', 'first_name', 'last_name', 'school_id'] };
      throw error;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }

    // Validate password strength
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.status = 400;
      throw error;
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (existingUser) {
      const error = new Error(`Email '${email}' is already registered`);
      error.status = 400;
      throw error;
    }

    // Verify school exists
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id, school_name')
      .eq('id', school_id)
      .maybeSingle();
    
    if (schoolError) {
      console.error('Error checking school:', schoolError);
      const error = new Error(`Failed to verify school: ${schoolError.message}`);
      error.status = 500;
      throw error;
    }
    
    if (!school) {
      const error = new Error(`School not found with ID: ${school_id}`);
      error.status = 404;
      throw error;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // STEP 1: Create user account with role 'teacher'
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash,
        first_name,
        last_name,
        phone_number: phone_number || null,
        role: 'teacher',
        is_active: true
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      const error = new Error(`Failed to create user account: ${userError.message}`);
      error.status = 500;
      error.details = userError;
      throw error;
    }

    if (!user || !user.id) {
      const error = new Error('User creation succeeded but returned no data. Check database RLS policies.');
      error.status = 500;
      throw error;
    }

    createdUserId = user.id;
    console.log('✅ User created:', user.id);

    // STEP 2: Create teacher record
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .insert([{
        user_id: user.id,
        school_id,
        hire_date: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (teacherError) {
      console.error('Error creating teacher:', teacherError);
      
      // ROLLBACK: Delete user since teacher creation failed
      console.log('🔄 Rolling back user creation...');
      await supabase.from('users').delete().eq('id', user.id);
      console.log('✅ Rollback completed');
      
      const error = new Error(`Failed to create teacher record: ${teacherError.message}`);
      error.status = 500;
      error.details = teacherError;
      throw error;
    }

    if (!teacher || !teacher.id) {
      // ROLLBACK: Delete user
      console.log('🔄 Rolling back user creation (no teacher data)...');
      await supabase.from('users').delete().eq('id', user.id);
      console.log('✅ Rollback completed');
      
      const error = new Error('Teacher creation succeeded but returned no data. Check database RLS policies.');
      error.status = 500;
      throw error;
    }

    console.log('✅ Teacher created:', teacher.id);
    console.log('✅ Transaction completed successfully');

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      teacher: teacher,
      message: `Teacher account created successfully for ${school.school_name}. You can now login with the provided credentials.`
    };
  } catch (error) {
    console.error('❌ createTeacher error:', error);
    
    // Ensure proper error structure
    if (!error.status) error.status = 500;
    if (!error.message) error.message = 'Unknown error occurred';
    
    throw error;
  }
};

export const listTeachers = async (schoolId = null) => {
  try {
    let query = supabase
      .from('teachers')
      .select(`
        *,
        user:users!teachers_user_id_fkey(
          id,
          email,
          first_name,
          last_name,
          phone_number
        ),
        school:schools!teachers_school_id_fkey(
          id,
          school_name
        )
      `);
    
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('listTeachers error:', error);
    throw error;
  }
};

export const getTeacher = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateTeacher = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteTeacher = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export default { createTeacher, listTeachers, getTeacher, updateTeacher, deleteTeacher };
