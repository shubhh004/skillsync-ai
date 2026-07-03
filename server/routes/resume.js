import { Router } from 'express';
import { getResume, updateResume, getAtsScore } from '../controllers/resume.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/ats', getAtsScore);
router.get('/', getResume);
router.put('/', updateResume);

export default router;
