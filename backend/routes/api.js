import express from 'express';
import projectMemberRoutes from './projectMemberRoutes.js';
import projectRoutes from './projectRoutes.js';
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import timelogRoutes from './timelogRoutes.js'

const router = express.Router();

// Sample API endpoint
router.get('/info', (req, res) => {
  res.json({
    app: 'Checkpoint Checklist API',
    version: '1.0.0',
    status: 'active'
  });
});

// Auth routes
router.use('/auth', authRoutes)

// User routes
router.use('/users', userRoutes);

// Project routes
router.use('/projects', projectRoutes);

// Project Member Routes
router.use('/project_members', projectMemberRoutes)

// Timelog routes
router.use('/timelogs', timelogRoutes);

// // Masters routes
// router.use('/masters', mastersRoutes);

// // Activity logs routes
// router.use('/activity-logs', activityLogRoutes);

export default router;