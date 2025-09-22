const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentIntentId: {
    type: String,
    unique: true, // only for Stripe payments
    sparse: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number
  },
  currency: {
    type: String,
    default: 'lkr'
  },

  // Common fields
  applicantName: { type: String },
  nicNumber: { type: String },

  // Shop Rent
  shopName: { type: String },

  // Property Tax
  propertyNo: { type: String },
  year: { type: Number },
  quarter: { type: Number },

  // License Fees
  licenseType: { type: String },

  // Penalties
  fineReason: { type: String },

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  paymentType: {
    type: String,
    enum: ['shop_rent', 'license_fee', 'penalty', 'property_tax', 'other'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: { type: Date },

  paymentPeriod: {
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: () => new Date().getMonth() + 1
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    }
  },

  metadata: {
    stripeCustomerId: String,
    stripeChargeId: String,
    receiptUrl: String,
    description: String
  },

  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  notes: String
}, {
  timestamps: true
});

// Auto-generate receipt number
paymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.receiptNumber) {
    const count = await mongoose.model('Payment').countDocuments();
    this.receiptNumber = `RCP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
paymentSchema.index({ nicNumber: 1, paymentDate: -1 });
paymentSchema.index({ shopName: 1, paymentDate: -1 });
paymentSchema.index({ propertyNo: 1, paymentDate: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'paymentPeriod.year': 1, 'paymentPeriod.month': 1 });

// Virtuals
paymentSchema.virtual('formattedAmount').get(function () {
  return `Rs. ${this.amount.toLocaleString()}`;
});

// Methods
paymentSchema.methods.isOverdue = function () {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'completed';
};

// Statics
paymentSchema.statics.findByNIC = function (nicNumber) {
  return this.find({ nicNumber }).sort({ paymentDate: -1 });
};

paymentSchema.statics.findByShop = function (shopName) {
  return this.find({ shopName }).sort({ paymentDate: -1 });
};

paymentSchema.statics.getPaymentStats = async function () {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

// ✅ Export Model
module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
