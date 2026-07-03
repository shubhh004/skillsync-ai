import { Router } from 'express';
import { sendMessage, getChats, getChat, deleteChat } from '../controllers/career.controller.js';
import {
  createRoadmap, getRoadmaps, getRoadmap,
  updateChecklist, deleteRoadmap, regenerateRoadmap, getLatestRoadmap,
} from '../controllers/roadmap.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

// Chat routes (unchanged)
router.post('/chat',      sendMessage);
router.get('/chats',      getChats);
router.get('/chat/:id',   getChat);
router.delete('/chat/:id', deleteChat);

// Roadmap routes
router.post('/roadmap',              createRoadmap);
router.get('/roadmaps',              getRoadmaps);
router.get('/roadmap/latest',        getLatestRoadmap);
router.get('/roadmap/:id',           getRoadmap);
router.put('/roadmap/:id/checklist', updateChecklist);
router.delete('/roadmap/:id',        deleteRoadmap);
router.post('/roadmap/:id/regenerate', regenerateRoadmap);

export default router;
