import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('majors').insert([payload]).select('*, school:schools(id, school_name)').single();
export const list = () => supabase.from('majors').select('*, school:schools(id, school_name)');
export const findById = (id) => supabase.from('majors').select('*, school:schools(id, school_name)').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('majors').update(changes).eq('id', id).select('*, school:schools(id, school_name)').single();
export const removeById = (id) => supabase.from('majors').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };