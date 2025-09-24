const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  NatureofComplaint: { 
    type: String, 
    required: true,
    trim: true
  },
  Name: { 
    type: String, 
    required: true,
    trim: true
  },
  NIC_Number: { 
    type: String, 
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic NIC validation for Sri Lankan format
        return /^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(v);
      },
      message: 'Invalid NIC format'
    }
  },
  Email: { 
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Email validation - allow empty but validate if provided
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  Phone_Number: { 
    type: String, 
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Sri Lankan phone number validation
        return /^(?:\+94|0)[0-9]{9}$/.test(v.replace(/\s+/g, ''));
      },
      message: 'Invalid phone number format'
    }
  },
  Address: { 
    type: String, 
    required: true,
    trim: true
  },
  Location: { 
    type: String, 
    required: true,
    trim: true
  },
  Grama_Niladhari_Division: { 
    type: String, 
    required: true,
    trim: true
  },
  Attach_Files: { 
    type: [String],
    default: []
  },
  Description: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'resolved', 'rejected'],
      message: 'Status must be either pending, resolved, or rejected'
    },
    default: 'pending',
    lowercase: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    lowercase: true
  },
  assignedTo: {
    type: String,
    trim: true,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: [1000, 'Resolution cannot exceed 1000 characters'],
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    default: null
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  versionKey: false // Removes __v field
});

// Indexes for better query performance
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ NIC_Number: 1 });
complaintSchema.index({ Email: 1 });
complaintSchema.index({ priority: 1 });

// Pre-save middleware to update timestamps based on status changes
complaintSchema.pre('save', function(next) {
  // Update lastUpdated on every save
  this.lastUpdated = new Date();
  
  // Set resolvedAt when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  
  // Set rejectedAt when status changes to rejected
  if (this.isModified('status') && this.status === 'rejected' && !this.rejectedAt) {
    this.rejectedAt = new Date();
  }
  
  // Clear resolution timestamps if status changes back to pending
  if (this.isModified('status') && this.status === 'pending') {
    this.resolvedAt = null;
    this.rejectedAt = null;
  }
  
  next();
});

// Pre-update middleware for findOneAndUpdate operations
complaintSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Update lastUpdated
  update.lastUpdated = new Date();
  
  // Handle status changes in updates
  if (update.status === 'resolved' && !update.resolvedAt) {
    update.resolvedAt = new Date();
    update.rejectedAt = null;
  }
  
  if (update.status === 'rejected' && !update.rejectedAt) {
    update.rejectedAt = new Date();
    update.resolvedAt = null;
  }
  
  if (update.status === 'pending') {
    update.resolvedAt = null;
    update.rejectedAt = null;
  }
  
  next();
});

// Virtual for calculating age of complaint
complaintSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = this.createdAt || new Date();
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for formatted status
complaintSchema.virtual('statusDisplay').get(function() {
  switch(this.status) {
    case 'pending': return 'Pending Review';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return 'Unknown';
  }
});

// Instance method to mark as urgent
complaintSchema.methods.markAsUrgent = function(reason = '') {
  this.isUrgent = true;
  this.priority = 'urgent';
  if (reason) {
    this.tags.push(`urgent-${reason}`);
  }
  return this.save();
};

// Instance method to resolve complaint
complaintSchema.methods.resolve = function(resolution = '') {
  this.status = 'resolved';
  this.resolution = resolution;
  this.resolvedAt = new Date();
  return this.save();
};

// Instance method to reject complaint
complaintSchema.methods.reject = function(reason = '') {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.rejectedAt = new Date();
  return this.save();
};

// Static method to get complaints by status
complaintSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get recent complaints
complaintSchema.statics.getRecent = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return this.find({ createdAt: { $gte: cutoffDate } }).sort({ createdAt: -1 });
};

// Static method to get statistics
complaintSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: 'pending' });
  const resolved = await this.countDocuments({ status: 'resolved' });
  const rejected = await this.countDocuments({ status: 'rejected' });
  
  return {
    total,
    pending,
    resolved,
    rejected,
    percentages: {
      pending: total > 0 ? ((pending / total) * 100).toFixed(1) : 0,
      resolved: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
      rejected: total > 0 ? ((rejected / total) * 100).toFixed(1) : 0
    }
  };
};

// Make sure virtuals are included when converting to JSON
complaintSchema.set('toJSON', { virtuals: true });
complaintSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Complaint", complaintSchema);