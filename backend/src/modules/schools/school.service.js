import bcrypt from 'bcrypt';
import supabase from '../../config/supabase.js';

/**
 * Create a school WITH user authentication account
 * This creates both user and school records ATOMICALLY
 * Uses transaction-like logic with rollback on failure
 */
export const createSchool = async (payload) => {
  let createdUserId = null;
  
  try {
    const { email, password, school_name, address, phone_number } = payload;
    
    // Validate required fields (School only needs email, password, school_name)
    if (!email || !password || !school_name) {
      const error = new Error('Missing required fields: email, password, school_name are required');
      error.status = 400;
      error.details = { required: ['email', 'password', 'school_name'] };
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

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // STEP 1: Create user account with role 'school'
    // Use school_name as the user's name (schools are institutions, not persons)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash,
        first_name: school_name,
        last_name: '(School)',
        phone_number: phone_number || null,
        role: 'school',
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

    // STEP 2: Create school record
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert([{
        user_id: user.id,
        school_name,
        address: address || null,
        phone_number: phone_number || null
      }])
      .select()
      .single();

    if (schoolError) {
      console.error('Error creating school:', schoolError);
      
      // ROLLBACK: Delete user since school creation failed
      console.log('🔄 Rolling back user creation...');
      await supabase.from('users').delete().eq('id', user.id);
      console.log('✅ Rollback completed');
      
      const error = new Error(`Failed to create school record: ${schoolError.message}`);
      error.status = 500;
      error.details = schoolError;
      throw error;
    }

    if (!school || !school.id) {
      // ROLLBACK: Delete user
      console.log('🔄 Rolling back user creation (no school data)...');
      await supabase.from('users').delete().eq('id', user.id);
      console.log('✅ Rollback completed');
      
      const error = new Error('School creation succeeded but returned no data. Check database RLS policies.');
      error.status = 500;
      throw error;
    }

    console.log('✅ School created:', school.id);
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
      school: school,
      message: 'School account created successfully. You can now login with the provided credentials.'
    };
  } catch (error) {
    console.error('❌ createSchool error:', error);
    
    // Ensure proper error structure
    if (!error.status) error.status = 500;
    if (!error.message) error.message = 'Unknown error occurred';
    
    throw error;
  }
};

export const listSchools = async (schoolId = null) => {
  try {
    let query = supabase
      .from('schools')
      .select(`
        *,
        user:users!schools_user_id_fkey(
          id,
          email,
          first_name,
          last_name,
          phone_number
        )
      `);
    
    if (schoolId) {
      query = query.eq('id', schoolId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('listSchools error:', error);
    throw error;
  }
};

export const getSchool = async (id) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        user:users!schools_user_id_fkey(
          id,
          email,
          first_name,
          last_name,
          phone_number
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      const notFoundError = new Error('School not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    return data;
  } catch (error) {
    console.error('getSchool error:', error);
    throw error;
  }
};

export const updateSchool = async (id, changes) => {
  try {
    const { school_name, address, phone_number, email, first_name, last_name } = changes;
    
    // Get school to find user_id
    const school = await getSchool(id);
    
    // Update school table
    const schoolUpdates = {};
    if (school_name !== undefined) schoolUpdates.school_name = school_name;
    if (address !== undefined) schoolUpdates.address = address;
    if (phone_number !== undefined) schoolUpdates.phone_number = phone_number;
    
    if (Object.keys(schoolUpdates).length > 0) {
      const { error: schoolError } = await supabase
        .from('schools')
        .update(schoolUpdates)
        .eq('id', id);
      
      if (schoolError) throw schoolError;
    }
    
    // Update user table if user fields provided
    const userUpdates = {};
    if (email !== undefined) userUpdates.email = email;
    if (first_name !== undefined) userUpdates.first_name = first_name;
    if (last_name !== undefined) userUpdates.last_name = last_name;
    if (phone_number !== undefined) userUpdates.phone_number = phone_number;
    
    if (Object.keys(userUpdates).length > 0) {
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdates)
        .eq('id', school.user_id);
      
      if (userError) throw userError;
    }
    
    return await getSchool(id);
  } catch (error) {
    console.error('updateSchool error:', error);
    throw error;
  }
};

export const deleteSchool = async (id) => {
  try {
    // Get school to find user_id
    const school = await getSchool(id);
    
    // Delete user (cascade will delete school)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', school.user_id);
    
    if (error) throw error;
    return { message: 'School and associated user deleted successfully' };
  } catch (error) {
    console.error('deleteSchool error:', error);
    throw error;
  }
};

export default { createSchool, listSchools, getSchool, updateSchool, deleteSchool };
