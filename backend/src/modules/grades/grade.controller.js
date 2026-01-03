import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './grade.service.js';

export const record = asyncHandler(async (req, res) => {
  const grade = await service.createGrade(req.body);
  return success(res, grade, 'Grade recorded', 201);
});

export const list = asyncHandler(async (req, res) => {
  const list = await service.listGrades();
  return success(res, list, 'Grades list');
});

export const get = asyncHandler(async (req, res) => {
  const item = await service.getGrade(req.params.id);
  return success(res, item, 'Grade fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateGrade(req.params.id, req.body);
  return success(res, updated, 'Grade updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteGrade(req.params.id);
  return success(res, null, 'Grade deleted');
});

export default { record, list, get, update, remove };