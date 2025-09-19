const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  shopNo: { type: String, required: true, unique: true },
  tenantName: { type: String, required: true },
  monthlyRent: { type: Number, required: true },
  arrears: { type: Number, default: 0 },
  lastPaidDate: { type: Date },
  status: { type: Boolean, default: true }
});

module.exports = mongoose.model("Shop", ShopSchema);
