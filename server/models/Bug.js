const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Bug description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: String,
    trim: true,
    maxlength: [50, 'Assignee name cannot exceed 50 characters']
  },
  reporter: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true,
    maxlength: [50, 'Reporter name cannot exceed 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
bugSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update updatedAt field before updating
bugSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Bug', bugSchema);