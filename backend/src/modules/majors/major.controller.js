import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './major.service.js';

export const create = asyncHandler(async (req, res) => {
  const major = await service.createMajor(req.body);
  return success(res, major, 'Major created', 201);
});

export const list = asyncHandler(async (req, res) => {
  const list = await service.listMajors();
  return success(res, list, 'Majors list');
});

export const get = asyncHandler(async (req, res) => {
  const item = await service.getMajor(req.params.id);
  return success(res, item, 'Major fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateMajor(req.params.id, req.body);
  return success(res, updated, 'Major updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteMajor(req.params.id);
  return success(res, null, 'Major deleted');
});

export default { create, list, get, update, remove };