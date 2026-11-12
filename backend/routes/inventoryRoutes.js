const express = require('express');
const router = express.Router();
const {
  getInventoryParts,
  addPart,
  updatePart,
  deletePart,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', authorize('admin', 'mechanic'), getInventoryParts);
router.post('/', authorize('admin'), addPart);
router.put('/:id', authorize('admin', 'mechanic'), updatePart);
router.delete('/:id', authorize('admin'), deletePart);

module.exports = router;
