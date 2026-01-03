import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './user.service.js';

export const list = asyncHandler(async (req, res) => {
  const users = await service.listUsers();
  return success(res, users, 'Users list');
});

export const create = asyncHandler(async (req, res) => {
  // Admin-only route: create a new user (delegates to auth service)
  const payload = req.body;
  const created = await service.createUserFromAdmin(payload);
  return success(res, created, 'User created', 201);
});

export const get = asyncHandler(async (req, res) => {
  const user = await service.getUser(req.params.id);
  return success(res, user, 'User fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateUser(req.params.id, req.body);
  return success(res, updated, 'User updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteUser(req.params.id);
  return success(res, null, 'User deleted', 200);
});

export default { list, get, update, remove };
