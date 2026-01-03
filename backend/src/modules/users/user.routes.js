import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/role.middleware.js';
import * as controller from './user.controller.js';

const router = express.Router();

router.get('/', authenticate, allowRoles('admin'), controller.list);
router.post('/', authenticate, allowRoles('admin'), controller.create);
router.get('/:id', authenticate, controller.get);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, allowRoles('admin'), controller.remove);

export default router;
