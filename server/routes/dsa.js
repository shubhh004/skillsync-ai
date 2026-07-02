import { Router } from 'express';
import {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/dsa.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/',     createProblem);
router.get('/',      getProblems);
router.get('/:id',   getProblem);
router.put('/:id',   updateProblem);
router.delete('/:id', deleteProblem);

export default router;
