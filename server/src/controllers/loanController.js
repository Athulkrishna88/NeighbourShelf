const Loan = require('../models/Loan');
const Item = require('../models/Item');
const User = require('../models/User');
const Rating = require('../models/Rating');

// Helper to auto-update overdue loans
const updateOverdueLoans = async (filter) => {
  const now = new Date();
  await Loan.updateMany(
    {
      ...filter,
      status: 'approved',
      dueDate: { $lt: now }
    },
    { $set: { status: 'overdue' } }
  );
};

// @desc    Create borrow request
// @route   POST /api/loans
// @access  Private (Member)
const requestLoan = async (req, res, next) => {
  try {
    const { itemId, startDate, dueDate, notes } = req.body;

    if (!itemId || !startDate || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, start date, and due date are required.'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // FR-4.2: System SHALL NOT allow member to request their own item
    if (String(item.owner) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot borrow your own item.'
      });
    }

    // FR-4.2: Item already on loan or hidden
    if (item.status === 'on_loan') {
      return res.status(409).json({
        success: false,
        message: 'This item is currently on loan to another member.'
      });
    }

    if (item.status === 'hidden') {
      return res.status(400).json({
        success: false,
        message: 'This item is currently unavailable.'
      });
    }

    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (isNaN(start.getTime()) || isNaN(due.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or return date format.'
      });
    }

    if (due <= start) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be after the start date.'
      });
    }

    // FR-4.1: Within the item's maximum loan duration
    const diffDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
    if (diffDays > item.maxLoanDays) {
      return res.status(400).json({
        success: false,
        message: `Requested loan duration of ${diffDays} days exceeds item limit of ${item.maxLoanDays} days.`
      });
    }

    // Check if borrower already has an active or pending loan for this item
    const existingBorrowerLoan = await Loan.findOne({
      item: item._id,
      borrower: req.user._id,
      status: { $in: ['pending', 'approved', 'overdue'] }
    });

    if (existingBorrowerLoan) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active or pending request for this item.'
      });
    }

    const loan = await Loan.create({
      item: item._id,
      borrower: req.user._id,
      lender: item.owner,
      startDate: start,
      dueDate: due,
      notes: notes ? notes.trim() : '',
      status: 'pending'
    });

    const populatedLoan = await Loan.findById(loan._id)
      .populate('item', 'title category condition photos maxLoanDays status')
      .populate('lender', 'name trustScore')
      .populate('borrower', 'name trustScore');

    res.status(201).json({
      success: true,
      loan: populatedLoan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user loans by role (lender or borrower)
// @route   GET /api/loans?role=lender|borrower
// @access  Private (Member)
const getLoans = async (req, res, next) => {
  try {
    const { role } = req.query;

    let query = {};
    if (role === 'lender') {
      query.lender = req.user._id;
    } else if (role === 'borrower') {
      query.borrower = req.user._id;
    } else {
      // Return all where user is either borrower or lender
      query.$or = [{ lender: req.user._id }, { borrower: req.user._id }];
    }

    // FR-4.6: Automatically mark overdue if return date has passed and loan was approved
    await updateOverdueLoans(query);

    const loans = await Loan.find(query)
      .populate('item', 'title category condition photos maxLoanDays status')
      .populate('lender', 'name email phone trustScore ratingsCount completedLoans bio')
      .populate('borrower', 'name email phone trustScore ratingsCount completedLoans bio')
      .sort({ createdAt: -1 });

    // FR-5.3: Reveal phone number ONLY between lender and borrower of an approved, overdue, or returned loan
    const sanitizedLoans = loans.map(l => {
      const loanObj = l.toObject();
      const isApprovedOrPast = ['approved', 'overdue', 'returned'].includes(loanObj.status);

      if (!isApprovedOrPast) {
        if (loanObj.lender) delete loanObj.lender.phone;
        if (loanObj.borrower) delete loanObj.borrower.phone;
      }
      return loanObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedLoans.length,
      loans: sanitizedLoans
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve borrow request
// @route   PATCH /api/loans/:id/approve
// @access  Private (Lender)
const approveLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan request not found.' });
    }

    // Verify req.user is the lender
    if (String(loan.lender) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the item lender can approve this request.'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Cannot approve loan with status '${loan.status}'.`
      });
    }

    // Check item still available
    const item = await Item.findById(loan.item);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Listed item not found.' });
    }

    if (item.status === 'on_loan') {
      return res.status(409).json({
        success: false,
        message: 'This item is already on loan.'
      });
    }

    // FR-4.3: Approve sets item to "on_loan" and declines overlapping pending requests
    loan.status = 'approved';
    await loan.save();

    item.status = 'on_loan';
    await item.save();

    // Decline overlapping pending requests for this item (FR-4.3)
    await Loan.updateMany(
      {
        _id: { $ne: loan._id },
        item: item._id,
        status: 'pending',
        // Dates overlap: startA <= dueB AND dueA >= startB
        startDate: { $lte: loan.dueDate },
        dueDate: { $gte: loan.startDate }
      },
      {
        $set: { status: 'declined' }
      }
    );

    const updatedLoan = await Loan.findById(loan._id)
      .populate('item', 'title category condition photos status')
      .populate('borrower', 'name phone email trustScore')
      .populate('lender', 'name phone email trustScore');

    res.status(200).json({
      success: true,
      message: 'Loan approved successfully.',
      loan: updatedLoan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Decline borrow request
// @route   PATCH /api/loans/:id/decline
// @access  Private (Lender)
const declineLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan request not found.' });
    }

    if (String(loan.lender) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the item lender can decline this request.'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Cannot decline a loan with status '${loan.status}'.`
      });
    }

    loan.status = 'declined';
    await loan.save();

    res.status(200).json({
      success: true,
      message: 'Loan request declined.',
      loan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel borrow request
// @route   PATCH /api/loans/:id/cancel
// @access  Private (Borrower)
const cancelLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan request not found.' });
    }

    // FR-4.4: Borrower SHALL be able to cancel a request that is still pending
    if (String(loan.borrower) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the borrower can cancel this request.'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Can only cancel requests that are currently pending.'
      });
    }

    loan.status = 'cancelled';
    await loan.save();

    res.status(200).json({
      success: true,
      message: 'Loan request cancelled.',
      loan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark item as returned
// @route   PATCH /api/loans/:id/return
// @access  Private (Lender)
const markReturned = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan request not found.' });
    }

    // FR-4.5: Lender SHALL be able to mark an item as returned
    if (String(loan.lender) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the lender can confirm the item return.'
      });
    }

    if (!['approved', 'overdue'].includes(loan.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot return loan with current status '${loan.status}'.`
      });
    }

    loan.status = 'returned';
    loan.returnedAt = new Date();
    await loan.save();

    // Make item available again (FR-4.5)
    await Item.findByIdAndUpdate(loan.item, { status: 'available' });

    // Increment completed loans for both parties
    await User.findByIdAndUpdate(loan.lender, { $inc: { completedLoans: 1 } });
    await User.findByIdAndUpdate(loan.borrower, { $inc: { completedLoans: 1 } });

    const updatedLoan = await Loan.findById(loan._id)
      .populate('item', 'title category status')
      .populate('borrower', 'name email phone')
      .populate('lender', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Item confirmed returned and is now available.',
      loan: updatedLoan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add rating for a completed loan
// @route   POST /api/loans/:id/ratings
// @access  Private (Lender or Borrower)
const addRating = async (req, res, next) => {
  try {
    const { score, comment } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found.' });
    }

    // FR-5.1: After a loan is returned, lender and borrower can rate each other
    if (loan.status !== 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Ratings can only be submitted after the loan has been marked returned.'
      });
    }

    const userIdStr = String(req.user._id);
    const isLender = String(loan.lender) === userIdStr;
    const isBorrower = String(loan.borrower) === userIdStr;

    if (!isLender && !isBorrower) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this loan.'
      });
    }

    const ratedUserId = isLender ? loan.borrower : loan.lender;

    // Check if already rated by this user (FR-5.1: once per loan)
    const existingRating = await Rating.findOne({
      loan: loan._id,
      rater: req.user._id
    });

    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a rating for this loan.'
      });
    }

    const ratingNum = Number(score);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be a number between 1 and 5.'
      });
    }

    const rating = await Rating.create({
      loan: loan._id,
      rater: req.user._id,
      ratedUser: ratedUserId,
      score: ratingNum,
      comment: comment ? comment.trim() : ''
    });

    // FR-5.2: System SHALL recalculate the rated member's trust score after every rating
    const allUserRatings = await Rating.find({ ratedUser: ratedUserId });
    const totalScore = allUserRatings.reduce((sum, r) => sum + r.score, 0);
    const avgScore = totalScore / allUserRatings.length;
    const roundedScore = Math.round(avgScore * 10) / 10;

    await User.findByIdAndUpdate(ratedUserId, {
      trustScore: roundedScore,
      ratingsCount: allUserRatings.length
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully.',
      rating
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get ratings for a loan
// @route   GET /api/loans/:id/ratings
// @access  Private (Member)
const getLoanRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ loan: req.params.id })
      .populate('rater', 'name')
      .populate('ratedUser', 'name');

    res.status(200).json({
      success: true,
      ratings
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestLoan,
  getLoans,
  approveLoan,
  declineLoan,
  cancelLoan,
  markReturned,
  addRating,
  getLoanRatings
};
