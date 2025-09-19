const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  year: { type: Number, required: true },
  amounts: {
    base: Number,
    areaAdj: Number,
    zoneAdj: Number,
    surcharges: Number,
    discount: Number,
    penalty: Number,
    total: Number
  },
  status: { type: String, enum: ["PENDING_PAYMENT", "ACTIVE", "EXPIRED"], default: "PENDING_PAYMENT" },
  issuedAt: Date,
  expiresAt: Date,
  certificateUrl: String
}, { timestamps: true });

LicenseSchema.index({ business: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("License", LicenseSchema);
