import express from 'express';
import { loginAdmin, addProject, getAllProjects, submitReviews, getPendingReviews, approveReview, getApprovedReviews, rejectReview, addTask, getAllInterns } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Authentication
router.post('/login', loginAdmin);

// Project Management
router.post('/projects', protect, addProject);
router.get('/projects', protect, getAllProjects);

// Review Moderation
router.post('/submit', submitReviews);
router.get('/reviews', protect, getPendingReviews);
router.get('/reviews/pending', protect, getPendingReviews);
router.put('/reviews/:reviewId/approve', protect, approveReview);
router.get('/reviews/approved', getApprovedReviews);
router.delete('/reviews/:reviewId/reject', protect, rejectReview);

// Task Management
router.post('/addTask', protect, addTask);
router.get('/interns', protect, getAllInterns);

export default router;
