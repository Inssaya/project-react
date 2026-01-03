import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './teacher.service.js';

export const create = asyncHandler(async (req, res) => {
  const teacher = await service.createTeacher(req.body);
  return success(res, teacher, 'Teacher created', 201);
});

export const list = asyncHandler(async (req, res) => {
  const list = await service.listTeachers();
  return success(res, list, 'Teachers list');
});

export const get = asyncHandler(async (req, res) => {
  const item = await service.getTeacher(req.params.id);
  return success(res, item, 'Teacher fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateTeacher(req.params.id, req.body);
  return success(res, updated, 'Teacher updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteTeacher(req.params.id);
  return success(res, null, 'Teacher deleted');
});

export default { create, list, get, update, remove };
