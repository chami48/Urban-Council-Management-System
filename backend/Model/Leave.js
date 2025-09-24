const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: [true, 'Employee ID is required'],
    trim: true,
    minlength: [3, 'Employee ID must be at least 3 characters long'],
    maxlength: [20, 'Employee ID cannot exceed 20 characters'],
    match: [/^[A-Za-z0-9]+$/, 'Employee ID can only contain letters and numbers']
  },
  leaveType: { 
    type: String, 
    required: [true, 'Leave type is required'],
    enum: {
      values: ['Annual', 'Sick', 'Casual', 'Personal', 'Maternity', 'Paternity', 'Emergency', 'Vacation', 'Other'],
      message: 'Please select a valid leave type'
    }
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  reason: { 
    type: String, 
    required: [true, 'Reason is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters long'],
    maxlength: [500, 'Reason cannot exceed 500 characters'],
    validate: {
      validator: function(value) {
        // Check for inappropriate characters
        const inappropriatePattern = /[<>{}[\]\\]/;
        return !inappropriatePattern.test(value);
      },
      message: 'Reason contains invalid characters'
    }
  },
  status: { 
    type: String, 
    enum: {
      values: ['Pending', 'Approved', 'Rejected'],
      message: 'Status must be either Pending, Approved, or Rejected'
    },
    default: 'Pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to prevent duplicate leave requests for the same employee on overlapping dates
LeaveSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });

// Pre-save middleware for additional validations
LeaveSchema.pre('save', function(next) {
  // Validate maximum leave duration based on leave type
  const maxDaysMap = {
    'Annual': 30,
    'Sick': 14,
    'Casual': 7,
    'Personal': 5,
    'Maternity': 180,
    'Paternity': 14,
    'Emergency': 3,
    'Vacation': 30,
    'Other': 10
  };
  
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = maxDaysMap[this.leaveType] || 10;
  
  if (diffDays > maxDays) {
    const error = new Error(`Maximum ${maxDays} days allowed for ${this.leaveType} leave`);
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Prevent future dates more than 1 year ahead
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (this.startDate > oneYearFromNow) {
    const error = new Error('Start date cannot be more than 1 year in the future');
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
});

// Pre-save middleware to check for overlapping leave requests
LeaveSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('endDate')) {
    try {
      const overlappingLeave = await this.constructor.findOne({
        _id: { $ne: this._id },
        employeeId: this.employeeId,
        status: { $in: ['Pending', 'Approved'] },
        $or: [
          {
            startDate: { $lte: this.endDate },
            endDate: { $gte: this.startDate }
          }
        ]
      });

      if (overlappingLeave) {
        const error = new Error('You already have an overlapping leave request for this period');
        error.name = 'ValidationError';
        return next(error);
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Leave', LeaveSchema);