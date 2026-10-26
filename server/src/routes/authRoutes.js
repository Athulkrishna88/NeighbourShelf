const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

// FR-1.1, FR-1.2, FR-1.3
router.post('/register', register);
// C-3, NFR-2.5: Rate limit login attempts to 10 per minute per IP
router.post('/login', loginLimiter, login);

module.exports = router;
