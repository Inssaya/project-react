import * as model from './class.model.js';

export const createClass = async (payload) => {
  const { data, error } = await model.create(payload);
  if (error) throw error;
  return data;
};

export const listClasses = async () => {
  const { data, error } = await model.list();
  if (error) throw error;
  return data;
};

export const getClass = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateClass = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteClass = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export default { createClass, listClasses, getClass, updateClass, deleteClass };
