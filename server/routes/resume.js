import { Router } from 'express';
import { getResume, updateResume } from '../controllers/resume.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getResume);
router.put('/', updateResume);

export default router;
