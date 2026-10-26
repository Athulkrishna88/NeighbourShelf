const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: [true, 'Loan reference is required'],
    index: true
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rater is required'],
    index: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rated user is required'],
    index: true
  },
  score: {
    type: Number,
    required: [true, 'Rating score is required'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Each user can rate each loan only once (FR-5.1)
ratingSchema.index({ loan: 1, rater: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
