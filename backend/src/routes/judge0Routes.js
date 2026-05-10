import express from 'express';
import { executeCode } from '../controllers/judge0Controller.js';

const router = express.Router();
// POST /api/execute
router.post('/execute', executeCode);

export default router;
