import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('classes').insert([payload]).select().single();
export const list = () => supabase.from('classes').select('*');
export const findById = (id) => supabase.from('classes').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('classes').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('classes').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
