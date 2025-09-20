const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  propertyNo: { type: String, required: true },
  year: { type: Number, required: true },
  annualTax: { type: Number, required: true },
  arrears: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  fine: { type: Number, default: 0 },
  payableAmount: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tax", taxSchema);
