import * as model from './attendance.model.js';

export const record = async (payload) => {
  const { data, error } = await model.create(payload);
  if (error) throw error;
  return data;
};

export const listAttendance = async () => {
  const { data, error } = await model.list();
  if (error) throw error;
  return data;
};

export const getAttendance = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateAttendance = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteAttendance = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export default { record, listAttendance, getAttendance, updateAttendance, deleteAttendance };
