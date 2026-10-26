// FR-6.4: Moderation endpoints SHALL return HTTP 403 to non-administrators.
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator access required.'
    });
  }
  next();
};

module.exports = { requireAdmin };
