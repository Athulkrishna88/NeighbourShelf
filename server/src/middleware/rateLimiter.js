const rateLimit = require('express-rate-limit');

// C-3: Login attempts SHALL be limited to 10 per minute per IP address.
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 login requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after a minute.'
  }
});

module.exports = { loginLimiter };
