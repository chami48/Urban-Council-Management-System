const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // Property tax payments
  propertyNo: { type: String },

  // Common fields
  year: { type: Number, required: true },
  quarter: { type: Number }, // optional for property tax
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  method: { 
    type: String, 
    enum: ["Cash", "Card", "Online", "MOCK"], 
    default: "Online" 
  },
  gatewayRef: String,
  status: { type: String, enum: ["INITIATED", "SUCCESS", "FAILED"], default: "SUCCESS" }
});

module.exports = mongoose.model("Payment", paymentSchema);
