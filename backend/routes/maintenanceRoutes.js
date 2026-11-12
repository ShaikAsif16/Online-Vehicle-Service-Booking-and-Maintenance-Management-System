const express = require('express');
const router = express.Router();
const {
  getMyMaintenanceHistory,
  getVehicleMaintenanceHistory,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my', getMyMaintenanceHistory);
router.get('/vehicle/:vehicleId', getVehicleMaintenanceHistory);

module.exports = router;
