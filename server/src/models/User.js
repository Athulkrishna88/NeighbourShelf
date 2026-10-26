const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    default: ''
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Locality',
    required: [true, 'Locality is required'],
    index: true
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
    index: true
  },
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  completedLoans: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

module.exports = mongoose.model('User', userSchema);
