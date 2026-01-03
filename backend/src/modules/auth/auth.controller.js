import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/response.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return success(res, { user }, 'User registered', 201);
});

export const login = asyncHandler(async (req, res) => {
  const payload = await authService.login(req.body);
  return success(res, payload, 'Logged in', 200);
});

export default { register, login };
