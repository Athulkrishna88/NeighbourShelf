const express = require('express');
const router = express.Router();
const { getMe, updateMe, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/:id', getUserProfile);

module.exports = router;
