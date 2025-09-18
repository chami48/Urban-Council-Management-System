const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  NatureofComplaint: { type: String, required: true },
  Name: { type: String, required: true },
  NIC_Number: { type: String, required: true },
  Email: { type: String },
  Phone_Number: { type: String, required: true },
  Address: { type: String, required: true },
  Location: { type: String, required: true },
  Grama_Niladhari_Division: { type: String, required: true },
  Attach_Files: { type: [String] },
  Description: { type: String, required: true },
});

// 👇 නම "Complaint" කියලා දාන්න
module.exports = mongoose.model("Complaint", complaintSchema);
