import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/role.middleware.js';
import * as controller from './teacher.controller.js';

const router = express.Router();

router.post('/', authenticate, allowRoles('admin','school'), controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.get);
router.put('/:id', authenticate, allowRoles('admin'), controller.update);
router.delete('/:id', authenticate, allowRoles('admin'), controller.remove);

export default router;
