const mongoose = require("mongoose");

const crematoriumSchema = new mongoose.Schema({
  applicantFullName: { 
    type: String, 
    required: [true, "Applicant full name is required"],
    trim: true
  },
  surname: { 
    type: String, 
    required: [true, "Applicant address is required"],
    trim: true
  },
  nic: { 
    type: String, 
    required: [true, "NIC number is required"],
    trim: true
  },
  deceasedFullName: { 
    type: String, 
    required: [true, "Deceased full name is required"],
    trim: true
  },
  dateOfDeath: { 
    type: Date, 
    required: [true, "Date of death is required"] 
  },
  residenceArea: { 
    type: String, 
    enum: ["within", "outside"], 
    default: "within",
    required: true 
  },
  registrationNumber: { 
    type: String, 
    trim: true 
  },
  beOrderImage: { 
    type: String,
    trim: true
  },
  naturalDeathCertificate: { 
    type: String,
    trim: true
  },
  cremationDate: { 
    type: Date, 
    required: [true, "Cremation date is required"] 
  },
  declarationAgreement: { 
    type: Boolean, 
    required: [true, "Declaration agreement is required"],
    default: false
  },
  deathCertificateImage: { 
    type: String, 
    required: [true, "Death certificate image is required"],
    trim: true
  },
    approve: {
    type: Boolean,
    default: false
},
reject: {
    type: Boolean,
    default: false
},
comment: {
    type: String,
    default: ''
},
statusUpdatedAt: {
    type: Date
}
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Crematorium", crematoriumSchema);