const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  area: { type: String, required: true }
});

module.exports = mongoose.model("Announcement", announcementSchema);
