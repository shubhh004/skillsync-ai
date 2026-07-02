import { Router } from 'express';
import { createJob, getJobs, getJob, updateJob, deleteJob } from '../controllers/job.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/',      createJob);
router.get('/',       getJobs);
router.get('/:id',    getJob);
router.put('/:id',    updateJob);
router.delete('/:id', deleteJob);

export default router;
