import express from 'express';
// import checkpointRoutes from './checkpointRoutes.js';
// import mastersRoutes from './mastersRoutes.js';
// import activityLogRoutes from './activityLogRoutes.js';
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'

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

// // Checkpoint routes
// router.use('/checkpoints', checkpointRoutes);

// // Masters routes
// router.use('/masters', mastersRoutes);

// // Activity logs routes
// router.use('/activity-logs', activityLogRoutes);

export default router;