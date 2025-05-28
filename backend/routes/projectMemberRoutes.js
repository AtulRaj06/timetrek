import express from 'express';
import { isProjectOrSuperAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { getProjectMembersByProjectId } from '../controllers/projectMemberController.js';


const router = express.Router();

// User routes
// router.get('/', verifyToken, getAllProjects);
router.get('/:projectId', verifyToken, getProjectMembersByProjectId);
// router.post('/', verifyToken, isProjectOrSuperAdmin, createProject);
// router.put('/:id', verifyToken, isProjectOrSuperAdmin, updateProject);
// router.delete('/:id', verifyToken, isSuperAdmin, deleteProject);

export default router;