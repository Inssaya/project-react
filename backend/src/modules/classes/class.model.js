import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('classes').insert([payload]).select('*, school:schools(id, school_name)').single();
export const list = () => supabase.from('classes').select('*, school:schools(id, school_name), major:majors(id, name)');
export const findById = (id) => supabase.from('classes').select('*, school:schools(id, school_name), major:majors(id, name)').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('classes').update(changes).eq('id', id).select('*, school:schools(id, school_name)').single();
export const removeById = (id) => supabase.from('classes').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
