import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('students').insert([payload]).select().single();
export const list = () => supabase.from('students').select('*');
export const findById = (id) => supabase.from('students').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('students').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('students').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
