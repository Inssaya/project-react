import express from 'express';
import * as controller from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Simple validation middleware using Joi
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    error.status = 400;
    return next(error);
  }
  return next();
};

// Registration is admin-only: only admins can create new users
router.post('/register', authenticate, allowRoles('admin'), validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);

export default router;
