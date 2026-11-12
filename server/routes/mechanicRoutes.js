const express = require('express');
const router = express.Router();
const {
  getAllMechanics,
  createMechanic,
  updateMechanic,
  getMyMechanicProfile,
} = require('../controllers/mechanicController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my-profile', authorize('mechanic'), getMyMechanicProfile);
router.get('/', authorize('admin'), getAllMechanics);
router.post('/', authorize('admin'), createMechanic);
router.put('/:id', authorize('admin', 'mechanic'), updateMechanic);

module.exports = router;
