import * as authService from '../auth/auth.service.js';
import * as model from './user.model.js';

export const listUsers = async () => {
  const { data, error } = await model.getAll();
  if (error) throw error;
  return data;
};

export const getUser = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateUser = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export const createUserFromAdmin = async (payload) => {
  // payload expected to contain email, password, first_name, last_name, role and optional class/major ids
  const { email, password, first_name, last_name, role, major_id, class_id } = payload;
  const created = await authService.register({ email, password, first_name, last_name, role });
  // Note: Profile associations are handled separately if needed
  return created;
};

export default { listUsers, getUser, updateUser, deleteUser, createUserFromAdmin };
