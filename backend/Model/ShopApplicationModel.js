
const mongoose = require("mongoose");

const ShopApplicationSchema = new mongoose.Schema({
  // Personal Information
  applicantName: { type: String, required: true },
  nicNumber: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  permanentAddress: { type: String, required: true },
  emergencyContact: { type: String },
  emergencyPhone: { type: String },

  // Business Information
  shopName: { type: String, required: true },
  businessCategory: { type: String, required: true },
  shopNo: { type: String },
  shopAddress: { type: String, required: true },
  shopArea: { type: Number, required: true },
  proposedActivities: { type: String, required: true },
  previousExperience: { type: String },

  // Rental Information
  requestedRent: { type: Number, required: true },
  leaseDuration: { type: String },

  // Additional Information
  expectedEmployees: { type: Number },
  utilitiesNeeded: [{ type: String }],
  documents: [{ type: String }], // store file paths
  additionalRequirements: { type: String },

  // Declarations
  agreeTerms: { type: Boolean, default: false },
  informationAccurate: { type: Boolean, default: false },

  // System fields  
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ShopApplication", ShopApplicationSchema);
