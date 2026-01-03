import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as service from './attendance.service.js';

export const record = asyncHandler(async (req, res) => {
  const payload = { ...req.body, recorded_by: req.user?.id };
  const entry = await service.record(payload);
  return success(res, entry, 'Attendance recorded', 201);
});

export const list = asyncHandler(async (req, res) => {
  const list = await service.listAttendance();
  return success(res, list, 'Attendance list');
});

export const get = asyncHandler(async (req, res) => {
  const item = await service.getAttendance(req.params.id);
  return success(res, item, 'Attendance fetched');
});

export const update = asyncHandler(async (req, res) => {
  const updated = await service.updateAttendance(req.params.id, req.body);
  return success(res, updated, 'Attendance updated');
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteAttendance(req.params.id);
  return success(res, null, 'Attendance deleted');
});

export default { record, list, get, update, remove };
