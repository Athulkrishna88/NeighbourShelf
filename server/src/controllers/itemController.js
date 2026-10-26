const Item = require('../models/Item');
const Loan = require('../models/Loan');

// @desc    Get items in member's locality with filters and pagination
// @route   GET /api/items
// @access  Private (Member)
const getItems = async (req, res, next) => {
  try {
    const { q, category, available, page = 1, limit = 12 } = req.query;

    // FR-3.1: Show ONLY items from the member's own locality
    const filter = {
      locality: req.user.locality,
      status: { $ne: 'hidden' } // Hidden items are not visible in search (Section 7.1)
    };

    // FR-3.2: "available now" filter
    if (available === 'true') {
      filter.status = 'available';
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Keyword search filter (title and description)
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // FR-3.3: Paginate results in blocks of 12 items
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [items, totalItems] = await Promise.all([
      Item.find(filter)
        .populate('owner', 'name trustScore ratingsCount completedLoans phone')
        .populate('locality', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(filter)
    ]);

    // Sanitize phone from owner for public browse (FR-5.3: revealed ONLY on approved loan)
    const sanitizedItems = items.map(item => {
      const itemObj = item.toObject();
      if (itemObj.owner && String(itemObj.owner._id) !== String(req.user._id)) {
        delete itemObj.owner.phone;
      }
      return itemObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedItems.length,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNum) || 1,
      currentPage: pageNum,
      items: sanitizedItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Private (Member)
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name bio trustScore ratingsCount completedLoans phone')
      .populate('locality', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const itemObj = item.toObject();
    // FR-5.3: Only reveal phone if user is the owner or has an approved/returned loan on it
    let revealPhone = false;
    if (String(item.owner._id) === String(req.user._id)) {
      revealPhone = true;
    } else {
      const activeLoan = await Loan.findOne({
        item: item._id,
        borrower: req.user._id,
        status: { $in: ['approved', 'overdue', 'returned'] }
      });
      if (activeLoan) {
        revealPhone = true;
      }
    }

    if (!revealPhone && itemObj.owner) {
      delete itemObj.owner.phone;
    }

    res.status(200).json({
      success: true,
      item: itemObj
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new item listing
// @route   POST /api/items
// @access  Private (Member)
const createItem = async (req, res, next) => {
  try {
    const { title, description, category, condition, maxLoanDays, photos } = req.body;

    // FR-2.1: Require title, category, and condition
    if (!title || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and condition are required.'
      });
    }

    // Check photos limit (max 3 entries)
    let photoArray = [];
    if (Array.isArray(photos)) {
      photoArray = photos.slice(0, 3);
    } else if (photos) {
      photoArray = [photos];
    }

    // Handle files uploaded via multipart form data if any
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => `/uploads/${file.filename}`);
      photoArray = [...photoArray, ...uploadedUrls].slice(0, 3);
    }

    const item = await Item.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      condition,
      photos: photoArray,
      maxLoanDays: Number(maxLoanDays) || 7,
      owner: req.user._id,
      locality: req.user.locality,
      status: 'available'
    });

    const populatedItem = await Item.findById(item._id)
      .populate('owner', 'name trustScore')
      .populate('locality', 'name');

    res.status(201).json({
      success: true,
      item: populatedItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Owner)
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // FR-2.2: Allow a member to edit only their own listings
    if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own listings.'
      });
    }

    const { title, description, category, condition, maxLoanDays, status, photos } = req.body;

    if (title) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (category) item.category = category.trim();
    if (condition) item.condition = condition;
    if (maxLoanDays) item.maxLoanDays = Number(maxLoanDays);

    // FR-2.3: Allow a member to mark listing as temporarily unavailable (hidden) or available
    if (status) {
      // Cannot mark as available if currently on loan
      if (item.status === 'on_loan' && status === 'available') {
        const activeLoan = await Loan.findOne({
          item: item._id,
          status: { $in: ['approved', 'overdue'] }
        });
        if (activeLoan) {
          return res.status(409).json({
            success: false,
            message: 'Cannot make item available while it is on loan.'
          });
        }
      }
      item.status = status;
    }

    if (photos && Array.isArray(photos)) {
      item.photos = photos.slice(0, 3);
    }

    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => `/uploads/${file.filename}`);
      item.photos = [...item.photos, ...uploadedUrls].slice(0, 3);
    }

    await item.save();

    const updatedItem = await Item.findById(item._id)
      .populate('owner', 'name trustScore')
      .populate('locality', 'name');

    res.status(200).json({
      success: true,
      item: updatedItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Owner)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // FR-2.2: Allow a member to delete only their own listings (or admin per FR-6.2)
    if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own listings.'
      });
    }

    // FR-2.4: System SHALL NOT allow deletion of a listing that has an active loan
    const activeLoan = await Loan.findOne({
      item: item._id,
      status: { $in: ['pending', 'approved', 'overdue'] }
    });

    if (activeLoan) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete item with an active or pending loan request.'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item listing deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's listed items
// @route   GET /api/items/my/listings
// @access  Private (Member)
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .populate('locality', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems
};
