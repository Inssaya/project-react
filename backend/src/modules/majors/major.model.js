import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('majors').insert([payload]).select().single();
export const list = () => supabase.from('majors').select('*');
export const findById = (id) => supabase.from('majors').select('*').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('majors').update(changes).eq('id', id).select().single();
export const removeById = (id) => supabase.from('majors').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };