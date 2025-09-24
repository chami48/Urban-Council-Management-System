const Announcement = require("../Model/announcementModel");

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = await Announcement.create(req.body);
    // Respond in the shape the frontend expects
    res.status(201).json({ announcement: newAnnouncement });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    // Respond in the shape the frontend expects
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Announcement not found" });
    // Keep response shape consistent
    res.json({ announcement: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
