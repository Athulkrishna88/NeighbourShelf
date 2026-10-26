const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/', getItems);
router.post('/', upload.array('photos', 3), createItem);
router.get('/my/listings', getMyItems);
router.get('/:id', getItemById);
router.put('/:id', upload.array('photos', 3), updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
