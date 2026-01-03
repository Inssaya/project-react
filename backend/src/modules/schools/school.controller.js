import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './school.service.js';

export const create = asyncHandler(async (req, res) => {
  const school = await service.createSchool(req.body);
  return success(res, school, 'School created', 201);
});

export const list = asyncHandler(async (req, res) => {
  const schools = await service.listSchools();
  return success(res, schools, 'Schools list');
});

export const get = asyncHandler(async (req, res) => {
  const school = await service.getSchool(req.params.id);
  return success(res, school, 'School fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateSchool(req.params.id, req.body);
  return success(res, updated, 'School updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteSchool(req.params.id);
  return success(res, null, 'School deleted');
});

export default { create, list, get, update, remove };
