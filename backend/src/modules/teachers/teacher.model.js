import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('teachers').insert([payload]).select().single();
export const list = () => supabase.from('teachers').select('*');
export const findById = (id) => supabase.from('teachers').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('teachers').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('teachers').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
