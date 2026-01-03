import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './class.service.js';

export const create = asyncHandler(async (req, res) => {
  const klass = await service.createClass(req.body);
  return success(res, klass, 'Class created', 201);
});

export const list = asyncHandler(async (req, res) => {
  const list = await service.listClasses();
  return success(res, list, 'Classes list');
});

export const get = asyncHandler(async (req, res) => {
  const item = await service.getClass(req.params.id);
  return success(res, item, 'Class fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateClass(req.params.id, req.body);
  return success(res, updated, 'Class updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteClass(req.params.id);
  return success(res, null, 'Class deleted');
});

export default { create, list, get, update, remove };
