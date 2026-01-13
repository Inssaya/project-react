import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('teachers').insert([payload]).select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name)').single();
export const list = () => supabase.from('teachers').select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name)');
export const findById = (id) => supabase.from('teachers').select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name)').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('teachers').update(changes).eq('id', id).select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name)').single();
export const removeById = (id) => supabase.from('teachers').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
