const Locality = require('../models/Locality');

// @desc    Get all localities
// @route   GET /api/localities
// @access  Public
const getAllLocalities = async (req, res, next) => {
  try {
    const localities = await Locality.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: localities.length,
      localities
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllLocalities };
