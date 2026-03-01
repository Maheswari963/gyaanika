const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public
router.post('/login', adminController.login);

// Protected
router.get('/reviews', authenticateAdmin, adminController.getReviews);
router.delete('/reviews/:id', authenticateAdmin, adminController.deleteReview);
router.post('/fix-issue', authenticateAdmin, adminController.fixIssue);

module.exports = router;
