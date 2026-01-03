import supabase from '../../config/supabase.js';
import * as model from './major.model.js';

export const createMajor = async (payload) => {
  const { name, description, school_id } = payload;

  // Validate required fields
  if (!name || !school_id) {
    const error = new Error('Major name and school_id are required');
    error.status = 400;
    throw error;
  }

  // Check if major already exists for this school
  const { data: existingMajor, error: existingError } = await supabase
    .from('majors')
    .select('id')
    .eq('school_id', school_id)
    .eq('name', name)
    .maybeSingle();

  if (existingMajor) {
    const error = new Error('Major with this name already exists for this school');
    error.status = 409;
    throw error;
  }

  const { data, error } = await model.create(payload);
  if (error) throw error;
  return data;
};

export const listMajors = async () => {
  const { data, error } = await model.list();
  if (error) throw error;
  return data;
};

export const getMajor = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateMajor = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteMajor = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export default { createMajor, listMajors, getMajor, updateMajor, deleteMajor };