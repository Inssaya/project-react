import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('attendance').insert([payload]).select().single();
export const list = () => supabase.from('attendance').select('*');
export const findById = (id) => supabase.from('attendance').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('attendance').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('attendance').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
