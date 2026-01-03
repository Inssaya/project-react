import supabase from '../../config/supabase.js';

export const createUser = async (user) => {
  // Use maybeSingle to avoid an exception when DB returns 0 rows
  const { data, error } = await supabase.from('users').insert([user]).select().maybeSingle();
  return { data, error };
};

export const findByEmail = async (email) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).limit(1).maybeSingle();
  return { data, error };
};

export const findById = async (id) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1).maybeSingle();
  return { data, error };
};

export default { createUser, findByEmail, findById };
