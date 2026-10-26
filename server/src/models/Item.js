const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'good', 'fair'],
    default: 'good'
  },
  photos: {
    type: [String],
    validate: [val => val.length <= 3, 'Cannot upload more than 3 photos'],
    default: []
  },
  maxLoanDays: {
    type: Number,
    required: [true, 'Maximum loan duration is required'],
    min: [1, 'Maximum loan duration must be at least 1 day'],
    default: 7
  },
  status: {
    type: String,
    enum: ['available', 'on_loan', 'hidden'],
    default: 'available',
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
    index: true
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Locality',
    required: [true, 'Locality is required'],
    index: true
  }
}, {
  timestamps: true
});

// Full-text search index on title and description (NFR-1.1, FR-3.2)
itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
