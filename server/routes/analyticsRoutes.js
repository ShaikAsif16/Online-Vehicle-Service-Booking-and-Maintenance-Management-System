const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);

module.exports = router;
