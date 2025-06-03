import express from "express";
import {
  isProjectOrSuperAdmin,
  verifyToken,
} from "../middleware/authMiddleware.js";
import {
  createProjectMember,
  deleteProjectMember,
  getProjectMembersByProjectId,
  updateUserProjects,
} from "../controllers/projectMemberController.js";

const router = express.Router();

// User routes
// router.get('/', verifyToken, getAllProjects);
router.get("/:projectId", verifyToken, getProjectMembersByProjectId);
router.post("/", verifyToken, isProjectOrSuperAdmin, createProjectMember);
// router.put('/:id', verifyToken, isProjectOrSuperAdmin, updateProject);
router.delete("/:id", verifyToken, isProjectOrSuperAdmin, deleteProjectMember);
router.get(
  "/users/:userId/updateProjects",
  verifyToken,
  isProjectOrSuperAdmin,
  updateUserProjects
);

export default router;
