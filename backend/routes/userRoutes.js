import express from 'express';
import { isProjectOrSuperAdmin, isSuperAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';


const router = express.Router();

// User routes
router.get('/', verifyToken, isProjectOrSuperAdmin, getAllUsers);
router.get('/:id', verifyToken, isSuperAdmin, getUserById);
router.post('/', createUser);
router.put('/:id', verifyToken, isSuperAdmin, updateUser);
router.delete('/:id', verifyToken, isSuperAdmin, deleteUser);

export default router;