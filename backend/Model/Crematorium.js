const mongoose = require("mongoose");

const crematoriumSchema = new mongoose.Schema(
  {
    // ---- Applicant / ownership ----
    applicantFullName: {
      type: String,
      required: [true, "Applicant full name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: [true, "Applicant email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    // ---- Identity ----
    nic: {
      type: String,
      required: [true, "NIC number is required"],
      trim: true,
    },

    // ---- Case & booking ----
    deceasedFullName: {
      type: String,
      required: [true, "Deceased full name is required"],
      trim: true,
    },
    dateOfDeath: { type: Date, required: [true, "Date of death is required"] },

    residenceArea: {
      type: String,
      enum: ["within", "outside"],
      default: "within",
      required: true,
    },

    registrationNumber: { type: String, trim: true },
    beOrderImage: { type: String, trim: true },
    naturalDeathCertificate: { type: String, trim: true },

    cremationDate: {
      type: Date,
      required: [true, "Cremation date is required"],
      index: true,
    },

    // NEW: time window (24h HH:mm)
    startTime: {
      type: String,
      required: [true, "Cremation start time is required"],
      match: [/^\d{2}:\d{2}$/, "Invalid start time (HH:mm)"],
    },
    endTime: {
      type: String,
      required: [true, "Cremation end time is required"],
      match: [/^\d{2}:\d{2}$/, "Invalid end time (HH:mm)"],
    },

    declarationAgreement: {
      type: Boolean,
      required: [true, "Declaration agreement is required"],
      default: false,
    },

    deathCertificateImage: {
      type: String,
      required: [true, "Death certificate image is required"],
      trim: true,
    },

    // ---- Admin review ----
    approve: { type: Boolean, default: false },
    reject: { type: Boolean, default: false },
    comment: { type: String, default: "" },
    statusUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crematorium", crematoriumSchema);
