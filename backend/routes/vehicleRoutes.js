const express = require('express');
const router = express.Router();
const {
  getMyVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', getMyVehicles);
router.post('/', addVehicle);
router.get('/', authorize('admin'), getAllVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
