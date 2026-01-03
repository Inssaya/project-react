import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('grades').insert([payload]).select().single();
export const list = () => supabase.from('grades').select('*');
export const findById = (id) => supabase.from('grades').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('grades').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('grades').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };