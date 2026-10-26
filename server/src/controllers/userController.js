const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private (Member)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('locality', 'name description');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        locality: user.locality,
        role: user.role,
        status: user.status,
        trustScore: user.trustScore,
        ratingsCount: user.ratingsCount,
        completedLoans: user.completedLoans,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private (Member)
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim().slice(0, 80);
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim().slice(0, 300);

    await user.save();

    const updatedUser = await User.findById(user._id).populate('locality', 'name');

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        locality: updatedUser.locality,
        role: updatedUser.role,
        status: updatedUser.status,
        trustScore: updatedUser.trustScore,
        ratingsCount: updatedUser.ratingsCount,
        completedLoans: updatedUser.completedLoans
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public member profile (trust score, completed loans, bio)
// @route   GET /api/users/:id
// @access  Private (Member)
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name bio locality trustScore ratingsCount completedLoans createdAt')
      .populate('locality', 'name');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, getUserProfile };
