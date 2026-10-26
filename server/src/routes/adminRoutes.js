const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  adminRemoveItem,
  createLocality,
  updateLocality
} = require('../controllers/adminController');
const { getAllLocalities } = require('../controllers/localityController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All admin routes require authentication and admin role (FR-6.4: HTTP 403 to non-administrators)
router.use(protect, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Localities management (FR-6.1)
router.get('/localities', getAllLocalities);
router.post('/localities', createLocality);
router.put('/localities/:id', updateLocality);

// Listing moderation (FR-6.2)
router.delete('/items/:id', adminRemoveItem);

module.exports = router;
