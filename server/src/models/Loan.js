const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item is required'],
    index: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Borrower is required'],
    index: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lender is required'],
    index: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'cancelled', 'returned', 'overdue'],
    default: 'pending',
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  },
  returnedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Check if overdue dynamically before query or updates
loanSchema.methods.checkOverdue = function () {
  if (this.status === 'approved' && new Date() > this.dueDate) {
    this.status = 'overdue';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Loan', loanSchema);
