import express from 'express';
import { isProjectOrSuperAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createProject, getAllProjects, getProjectById, updateProject } from '../controllers/projectController.js';


const router = express.Router();

// User routes
router.get('/', verifyToken, getAllProjects);
router.get('/:id', verifyToken, getProjectById);
router.post('/', verifyToken, isProjectOrSuperAdmin, createProject);
router.put('/:id', verifyToken, isProjectOrSuperAdmin, updateProject);
// router.delete('/:id', verifyToken, isSuperAdmin, deleteProject);

export default router;