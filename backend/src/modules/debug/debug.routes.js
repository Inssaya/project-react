import express from 'express';
import controller from './debug.controller.js';

const router = express.Router();

// POST /api/debug/supabase-test
router.post('/supabase-test', controller.supabaseTest);

export default router;
