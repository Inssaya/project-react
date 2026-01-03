import supabase from '../../config/supabase.js';

export const create = async (payload) => supabase.from('schools').insert([payload]).select().single();
export const list = async () => supabase.from('schools').select('*');
export const findById = async (id) => supabase.from('schools').select('*').eq('id', id).limit(1).single();
export const updateById = async (id, changes) => supabase.from('schools').update(changes).eq('id', id).select().single();
export const removeById = async (id) => supabase.from('schools').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
