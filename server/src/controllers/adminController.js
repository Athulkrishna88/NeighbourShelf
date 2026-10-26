const User = require('../models/User');
const Item = require('../models/Item');
const Loan = require('../models/Loan');
const Locality = require('../models/Locality');

// @desc    Get system-wide stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const [usersCount, itemsCount, activeLoansCount, localitiesCount, recentUsers, recentItems] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Loan.countDocuments({ status: { $in: ['pending', 'approved', 'overdue'] } }),
      Locality.countDocuments(),
      User.find().populate('locality', 'name').sort({ createdAt: -1 }).limit(10),
      Item.find().populate('owner', 'name email').populate('locality', 'name').sort({ createdAt: -1 }).limit(10)
    ]);

    res.status(200).json({
      success: true,
      stats: {
        usersCount,
        itemsCount,
        activeLoansCount,
        localitiesCount
      },
      recentUsers,
      recentItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List all users with pagination and search
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate('locality', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Suspend or reinstate user
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // FR-6.3: Administrators SHALL be able to suspend and reinstate users
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'suspended'."
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Do not allow suspending another admin
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify status of another administrator.'
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${status === 'suspended' ? 'suspended' : 'reinstated'}.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin remove any listing and cancel its pending requests
// @route   DELETE /api/admin/items/:id
// @access  Private (Admin)
const adminRemoveItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // FR-6.2: Administrators SHALL be able to remove any listing; its pending requests are then cancelled.
    await Loan.updateMany(
      { item: item._id, status: 'pending' },
      { $set: { status: 'cancelled' } }
    );

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item removed and pending requests cancelled.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin create locality
// @route   POST /api/admin/localities
// @access  Private (Admin)
const createLocality = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Locality name is required.'
      });
    }

    const existing = await Locality.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Locality with this name already exists.'
      });
    }

    const locality = await Locality.create({
      name: name.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      locality
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin rename locality
// @route   PUT /api/admin/localities/:id
// @access  Private (Admin)
const updateLocality = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const locality = await Locality.findById(req.params.id);
    if (!locality) {
      return res.status(404).json({ success: false, message: 'Locality not found.' });
    }

    if (name) locality.name = name.trim();
    if (description !== undefined) locality.description = description.trim();

    await locality.save();

    res.status(200).json({
      success: true,
      locality
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  adminRemoveItem,
  createLocality,
  updateLocality
};
