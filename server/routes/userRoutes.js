const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/status', toggleUserStatus);

module.exports = router;
