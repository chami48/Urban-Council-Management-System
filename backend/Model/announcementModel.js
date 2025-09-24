const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: true },   // <-- add this
  description: { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  area:        { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
