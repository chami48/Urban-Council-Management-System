// backend/Model/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopApplication',
  },
  paymentIntentId: {
    type: String,
    unique: true,
    sparse: true
  },
  amount: { type: Number, required: true },
  amountPaid: Number,
  currency: { type: String, default: 'lkr' },
  applicantName: String,
  nicNumber: String,
  shopName: String,
  propertyNo: String,
  year: Number,
  quarter: Number,
  licenseType: String,
  fineReason: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String, default: 'card' },
  paymentType: {
    type: String,
    enum: ['shop_rent', 'license_fee', 'penalty', 'property_tax', 'other'],
    required: true
  },
  paymentDate: { type: Date, default: Date.now },
  dueDate: Date,
  paymentPeriod: {
    month: { type: Number, min: 1, max: 12, default: () => new Date().getMonth() + 1 },
    year: { type: Number, default: () => new Date().getFullYear() }
  },
  metadata: {
    stripeCustomerId: String,
    stripeChargeId: String,
    receiptUrl: String,
    description: String
  },
  receiptNumber: { type: String, unique: true, sparse: true },
  notes: String
}, { timestamps: true });

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
paymentSchema.index({ applicationId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'paymentPeriod.year': 1, 'paymentPeriod.month': 1 });

// Virtual
paymentSchema.virtual('formattedAmount').get(function () {
  return `Rs. ${this.amount.toLocaleString()}`;
});

// Statics
paymentSchema.statics.findByNIC = function (nicNumber) {
  return this.find({ nicNumber }).sort({ paymentDate: -1 });
};
paymentSchema.statics.findByShop = function (shopName) {
  return this.find({ shopName }).sort({ paymentDate: -1 });
};
paymentSchema.statics.getPaymentStats = async function () {
  return this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
  ]);
};

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
