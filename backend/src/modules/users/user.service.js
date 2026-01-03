import * as model from './user.model.js';
import * as authService from '../auth/auth.service.js';

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
  // payload expected to contain email, password, full_name, role and optional class/major ids
  const { email, password, full_name, role, major_id, class_id } = payload;
  const created = await authService.register({ email, password, full_name, role });
  // If there are class or major associations, create profile details
  if (created && created.id && (major_id || class_id)) {
    try {
      await authService.createProfileForUser(created.id, role, major_id || null, class_id || null);
    } catch (err) {
      // Log and continue; profile creation errors should not block user creation here
      console.error('Warning: failed to add extra profile details for user', err);
    }
  }
  return created;
};

export default { listUsers, getUser, updateUser, deleteUser, createUserFromAdmin };
