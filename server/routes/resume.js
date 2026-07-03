import { Router } from 'express';
import { getResume, updateResume, getAtsScore, matchJobDescription } from '../controllers/resume.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/ats', getAtsScore);
router.post('/ats/match', matchJobDescription);
router.get('/', getResume);
router.put('/', updateResume);

export default router;
