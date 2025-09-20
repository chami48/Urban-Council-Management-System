const Playground = require("../Model/PlaygroundModel");
const sendEmail = require("../sendEmail"); // keep if you use email; otherwise remove this line

// safe date parser
const toDateOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// GET /playgrounds
const getAllPlaygrounds = async (req, res) => {
  try {
    const items = await Playground.find().sort({ createdAt: -1 });
    return res.status(200).json({ items, count: items.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /playgrounds
const createPlayground = async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      description,
      organizerName,
      email,
      phone,
      playgroundType,
      expectedAttendees,
      eventDate,
      startTime,
      endTime,
      specialRequirement,
    } = req.body;

    const required = {
      eventName,
      eventType,
      description,
      organizerName,
      email,
      phone,
      playgroundType,
      expectedAttendees,
      eventDate,
      startTime,
      endTime,
    };
    const missing = Object.entries(required)
      .filter(([_, v]) => v === undefined || v === null || v === "")
      .map(([k]) => k);
    if (missing.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const normalizedDate = toDateOrNull(eventDate);
    if (!normalizedDate) {
      return res.status(400).json({ message: "Invalid eventDate" });
    }

    const booking = await Playground.create({
      eventName,
      eventType,
      description,
      organizerName,
      email,
      phone,
      playgroundType,
      expectedAttendees,
      eventDate: normalizedDate,
      startTime,
      endTime,
      specialRequirement,
      status: "Pending",
    });

    return res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

// GET /playgrounds/:id
const getPlaygroundById = async (req, res) => {
  try {
    const booking = await Playground.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /playgrounds/:id
const updatePlayground = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.eventDate) {
      const d = toDateOrNull(payload.eventDate);
      if (!d) return res.status(400).json({ message: "Invalid eventDate" });
      payload.eventDate = d;
    }

    const booking = await Playground.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
};

// DELETE /playgrounds/:id
const deletePlayground = async (req, res) => {
  try {
    const booking = await Playground.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking deleted", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Delete failed" });
  }
};

// PATCH /playgrounds/update-status/:id
// Body: { action: "approve" | "reject", comment?: string }
const updateBookingStatus = async (req, res) => {
  try {
    const { action, comment } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ message: 'Invalid action. Use "approve" or "reject".' });
    }

    const status = action === "approve" ? "Approved" : "Rejected";

    const booking = await Playground.findByIdAndUpdate(
      req.params.id,
      { status, comment: comment || "", statusUpdatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Best-effort email (optional)
    try {
      const subject = `Your booking is ${status}`;
      const message =
        `Hello ${booking.organizerName},\n\n` +
        `Your booking for "${booking.eventName}" has been ${status}.\n` +
        (comment ? `\nNote: ${comment}\n` : "") +
        `\nThank you.`;
      await sendEmail(booking.email, subject, message);
    } catch (e) {
      console.error("Email send failed:", e?.message || e);
    }

    return res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// POST /playgrounds/check-availability
const checkAvailability = async (req, res) => {
  try {
    const { date, playgroundType } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const d = toDateOrNull(date);
    if (!d) return res.status(400).json({ message: "Invalid date" });

    const q = { eventDate: d };
    if (playgroundType) q.playgroundType = playgroundType;

    const existing = await Playground.findOne(q);
    if (existing) {
      return res.json({ available: false, message: "❌ Already booked for this date" });
    }
    return res.json({ available: true, message: "✅ Available for booking" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllPlaygrounds,
  createPlayground,
  getPlaygroundById,
  updatePlayground,
  deletePlayground,
  updateBookingStatus,
  checkAvailability,
};
