import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './student.service.js';

export const create = asyncHandler(async (req, res) => {
  const student = await service.createStudent(req.body);
  return success(res, student, 'Student created', 201);
});

export const list = asyncHandler(async (req, res) => {
  const students = await service.listStudents();
  return success(res, students, 'Students list');
});

export const get = asyncHandler(async (req, res) => {
  const student = await service.getStudent(req.params.id);
  return success(res, student, 'Student fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateStudent(req.params.id, req.body);
  return success(res, updated, 'Student updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteStudent(req.params.id);
  return success(res, null, 'Student deleted');
});

export default { create, list, get, update, remove };
