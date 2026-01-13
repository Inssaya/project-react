import supabase from '../../config/supabase.js';

export const create = (payload) => supabase.from('students').insert([payload]).select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name), class:classes(id, name), major:majors(id, name)').single();
export const list = () => supabase.from('students').select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name), class:classes(id, name), major:majors(id, name)');
export const findById = (id) => supabase.from('students').select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name), class:classes(id, name), major:majors(id, name)').eq('id', id).limit(1).single();
export const updateById = (id, changes) => supabase.from('students').update(changes).eq('id', id).select('*, user:users(id, email, first_name, last_name, phone_number), school:schools(id, school_name), class:classes(id, name)').single();
export const removeById = (id) => supabase.from('students').delete().eq('id', id);

export default { create, list, findById, updateById, removeById };
