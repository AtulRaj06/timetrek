import express from 'express';
import { isProjectOrSuperAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createTimelog, getMyTimelogs, getMyTimelogsfromProjectId } from '../controllers/timelogController.js';


const router = express.Router();

// User routes
// router.get('/', verifyToken, getAllProjects);
router.get('/my', verifyToken, getMyTimelogs);
router.get('/my/project/:projectId', verifyToken, getMyTimelogsfromProjectId)
router.post('/', verifyToken, createTimelog);
// router.put('/:id', verifyToken, isProjectOrSuperAdmin, updateProject);
// router.delete('/:id', verifyToken, isSuperAdmin, deleteProject);

export default router;