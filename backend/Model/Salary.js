// Salary model for MongoDB (Mongoose)
const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  //employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeId: { 
    type: String, 
    required: [true, 'Employee ID is required'],
    trim: true,
    match: [/^EMP\d{4}$/, 'Employee ID must be in format EMP0001'],
    index: true
  },
  month: { 
    type: String, 
    required: [true, 'Month is required'],
    enum: {
      values: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December'],
      message: 'Please select a valid month'
    }
  },
  year: { 
    type: Number, 
    required: [true, 'Year is required'],
    min: [new Date().getFullYear() - 10, 'Year cannot be more than 10 years old'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'],
    validate: {
      validator: Number.isInteger,
      message: 'Year must be a whole number'
    }
  },
  basicSalary: { 
    type: Number, 
    required: [true, 'Basic salary is required'],
    min: [50000, 'Basic salary must be at least Rs 50,000'],
    max: [500000000, 'Basic salary cannot exceed Rs 500,000,000'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Basic salary must be greater than 0'
    }
  },
  allowances: {
    transport: { 
      type: Number, 
      default: 0,
      min: [0, 'Transport allowance cannot be negative'],
      max: [50000000, 'Transport allowance seems too high']
    },
    meal: { 
      type: Number, 
      default: 0,
      min: [0, 'Meal allowance cannot be negative'],
      max: [50000000, 'Meal allowance seems too high']
    },
    medical: { 
      type: Number, 
      default: 0,
      min: [0, 'Medical allowance cannot be negative'],
      max: [50000000, 'Medical allowance seems too high']
    },
    other: { 
      type: Number, 
      default: 0,
      min: [0, 'Other allowance cannot be negative'],
      max: [50000000, 'Other allowance seems too high']
    }
  },
  overtime: {
    normalDayHours: { 
      type: Number, 
      default: 0,
      min: [0, 'Normal day hours cannot be negative'],
      max: [500, 'Normal day hours cannot exceed 500 per month']
    },
    holidayHours: { 
      type: Number, 
      default: 0,
      min: [0, 'Holiday hours cannot be negative'],
      max: [200, 'Holiday hours cannot exceed 200 per month']
    },
    normalDayRate: { 
      type: Number, 
      default: 0,
      min: [0, 'Normal day rate cannot be negative'],
      max: [50000, 'Normal day rate seems too high']
    },
    holidayRate: { 
      type: Number, 
      default: 0,
      min: [0, 'Holiday rate cannot be negative'],
      max: [100000, 'Holiday rate seems too high']
    },
    total: { 
      type: Number, 
      default: 0,
      min: [0, 'Overtime total cannot be negative']
    }
  },
  deductions: {
    loan: { 
      type: Number, 
      default: 0,
      min: [0, 'Loan deduction cannot be negative']
    },
    epf: { 
      type: Number, 
      default: 0,
      min: [0, 'EPF deduction cannot be negative']
    },
    etf: { 
      type: Number, 
      default: 0,
      min: [0, 'ETF deduction cannot be negative']
    },
    insurance: { 
      type: Number, 
      default: 0,
      min: [0, 'Insurance deduction cannot be negative']
    },
    other: { 
      type: Number, 
      default: 0,
      min: [0, 'Other deduction cannot be negative']
    }
  },
  netSalary: { 
    type: Number, 
    required: [true, 'Net salary is required'],
    min: [0, 'Net salary cannot be negative']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound unique index to prevent duplicate salary records for same employee/month/year
SalarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

// Pre-save middleware for business logic validations
SalarySchema.pre('save', function(next) {
  // Validate total deductions don't exceed basic salary
  const totalDeductions = this.deductions.loan + this.deductions.epf + 
                          this.deductions.etf + this.deductions.insurance + 
                          this.deductions.other;
  
  if (totalDeductions > this.basicSalary) {
    const error = new Error('Total deductions cannot exceed basic salary');
    error.name = 'ValidationError';
    return next(error);
  }

  // Validate individual deductions don't exceed basic salary
  const deductionFields = ['loan', 'epf', 'etf', 'insurance', 'other'];
  for (let field of deductionFields) {
    if (this.deductions[field] > this.basicSalary) {
      const error = new Error(`${field.toUpperCase()} deduction cannot exceed basic salary`);
      error.name = 'ValidationError';
      return next(error);
    }
  }

  // Validate future month/year combination
  const currentDate = new Date();
  const salaryDate = new Date(this.year, getMonthNumber(this.month));
  
  if (salaryDate > currentDate) {
    const error = new Error('Cannot create salary record for future months');
    error.name = 'ValidationError';
    return next(error);
  }

  // Calculate and validate overtime total
  const calculatedOvertimeTotal = (this.overtime.normalDayHours * this.overtime.normalDayRate) + 
                                  (this.overtime.holidayHours * this.overtime.holidayRate);
  
  if (Math.abs(this.overtime.total - calculatedOvertimeTotal) > 0.01) {
    this.overtime.total = calculatedOvertimeTotal;
  }

  // Auto-calculate net salary if not provided or incorrect
  const totalAllowances = this.allowances.transport + this.allowances.meal + 
                          this.allowances.medical + this.allowances.other;
  
  const calculatedNetSalary = this.basicSalary + totalAllowances + 
                              this.overtime.total - totalDeductions;
  
  if (Math.abs(this.netSalary - calculatedNetSalary) > 0.01) {
    this.netSalary = Math.max(0, calculatedNetSalary);
  }

  next();
});

// Pre-save middleware to prevent duplicate records
SalarySchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const existingSalary = await this.constructor.findOne({
        employeeId: this.employeeId,
        month: this.month,
        year: this.year
      });

      if (existingSalary) {
        const error = new Error(`Salary record already exists for ${this.month} ${this.year} for employee ${this.employeeId}`);
        error.name = 'ValidationError';
        error.code = 11000; // Duplicate key error code
        return next(error);
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Helper function for month number conversion
function getMonthNumber(monthName) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName);
}

module.exports = mongoose.model('Salary', SalarySchema);