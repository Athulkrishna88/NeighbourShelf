const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Locality name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Locality name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Locality', localitySchema);
