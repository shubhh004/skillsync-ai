import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview,
  evaluateAnswers,
} from '../controllers/interview.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/evaluate', evaluateAnswers);
router.post('/',    createInterview);
router.get('/',     getInterviews);
router.get('/:id',  getInterview);
router.put('/:id',  updateInterview);
router.delete('/:id', deleteInterview);

export default router;
