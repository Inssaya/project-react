import supabase from '../../config/supabase.js';

// User model: thin wrapper over Supabase queries for users table
export const getAll = () => supabase.from('users').select('*');

export const findById = (id) =>
  supabase.from('users').select('*').eq('id', id).limit(1).single();

export const updateById = (id, changes) =>
  supabase.from('users').update(changes).eq('id', id).select().single();

export const removeById = (id) => supabase.from('users').delete().eq('id', id);

export default { getAll, findById, updateById, removeById };
