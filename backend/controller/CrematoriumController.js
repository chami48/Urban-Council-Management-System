const Crematorium = require("../Model/Crematorium");
const path = require("path");
const nodemailer = require("nodemailer");

// optional email (skips if not configured)
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const computeStatus = (doc) => (doc.approve ? "Approved" : doc.reject ? "Rejected" : "Pending");
const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};
const timeRangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

// ---------- GET all (filterable by user/email) ----------
const getAllCrematoriumBookings = async (req, res) => {
  try {
    const { userId, email } = req.query;
    const q = {};
    if (userId) q.userId = userId;
    if (email) q.applicantEmail = String(email).toLowerCase();
    if (req.user?._id) q.userId = req.user._id; // enforce if auth middleware present

    const bookings = await Crematorium.find(q).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error("getAllCrematoriumBookings error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching bookings" });
  }
};

// ---------- POST create ----------
const addCrematoriumBooking = async (req, res) => {
  try {
    const { files, body } = req;

    const required = [
      "applicantFullName",
      "address",
      "applicantEmail",
      "nic",
      "deceasedFullName",
      "dateOfDeath",
      "cremationDate",
      "startTime",
      "endTime",
    ];
    for (const f of required) {
      if (!body[f]) return res.status(400).json({ success: false, message: `${f} is required` });
    }

    // validate declaration
    if (body.declarationAgreement !== "true" && body.declarationAgreement !== true) {
      return res.status(400).json({ success: false, message: "You must agree to the declaration" });
    }

    // validate time window
    if (!/^\d{2}:\d{2}$/.test(body.startTime) || !/^\d{2}:\d{2}$/.test(body.endTime)) {
      return res.status(400).json({ success: false, message: "Invalid time format (use HH:mm 24h)" });
    }
    const s = toMinutes(body.startTime);
    const e = toMinutes(body.endTime);
    if (!(s < e)) {
      return res.status(400).json({ success: false, message: "End time must be after start time" });
    }

    // require death certificate file
    const deathCertFile = files?.deathCertificateImage?.[0];
    if (!deathCertFile) {
      return res.status(400).json({ success: false, message: "Death certificate image is required" });
    }

    // normalize paths for DB
    const deathCertificateImagePath = path
      .relative(path.join(__dirname, "../"), deathCertFile.path)
      .replace(/\\/g, "/");

    const beOrderImagePath = files?.beOrderImage?.[0]
      ? path.relative(path.join(__dirname, "../"), files.beOrderImage[0].path).replace(/\\/g, "/")
      : null;

    const bookingData = {
      applicantFullName: body.applicantFullName,
      address: body.address,
      applicantEmail: String(body.applicantEmail).toLowerCase(),
      userId: req.user?._id || body.userId || null,

      nic: body.nic,
      deceasedFullName: body.deceasedFullName,
      dateOfDeath: new Date(body.dateOfDeath),
      residenceArea: body.residenceArea || "within",
      registrationNumber: body.registrationNumber || "",
      naturalDeathCertificate: body.naturalDeathCertificate || "",

      cremationDate: new Date(body.cremationDate),
      startTime: body.startTime,
      endTime: body.endTime,

      declarationAgreement: true,
      deathCertificateImage: deathCertificateImagePath,
      beOrderImage: beOrderImagePath,
    };

    // OPTIONAL: check overlap before save (server-side guard)
    const sameDay = new Date(bookingData.cremationDate);
    sameDay.setHours(0, 0, 0, 0);
    const nextDay = new Date(sameDay);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayBookings = await Crematorium.find({
      cremationDate: { $gte: sameDay, $lt: nextDay },
    }).select("_id startTime endTime");

    const clash = dayBookings.some((b) =>
      timeRangesOverlap(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
    );
    if (clash) {
      return res.status(409).json({
        success: false,
        message: "Selected time overlaps with an existing booking on that date",
      });
    }

    const booking = new Crematorium(bookingData);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Crematorium booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create booking" });
  }
};

// ---------- PATCH update status (with optional email) ----------
const updateCrematoriumBookingStatus = async (req, res) => {
  const id = req.params.id;
  const { approve, reject, comment } = req.body;

  try {
    const booking = await Crematorium.findByIdAndUpdate(
      id,
      {
        approve: Boolean(approve) === true,
        reject: Boolean(reject) === true,
        comment: comment || "",
        statusUpdatedAt: new Date(),
      },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const status = computeStatus(booking);

    if (transporter && booking.applicantEmail) {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER,
          to: booking.applicantEmail,
          subject: `Crematorium request ${status}`,
          html: `
            <p>Dear ${booking.applicantFullName || "Applicant"},</p>
            <p>Your crematorium request for <strong>${booking.deceasedFullName || "the deceased"}</strong> on
            <strong>${new Date(booking.cremationDate).toLocaleDateString()}</strong>
            from <strong>${booking.startTime}</strong> to <strong>${booking.endTime}</strong> is now: <b>${status}</b>.</p>
            ${booking.comment ? `<p><b>Admin comment:</b> ${booking.comment}</p>` : ""}
            <p>Ref: ${booking._id}</p>
          `,
        });
      } catch (mailErr) {
        console.warn("Email send failed (non-fatal):", mailErr.message);
      }
    }

    res.status(200).json({ message: "Crematorium booking status updated successfully", data: booking });
  } catch (error) {
    console.error("updateCrematoriumBookingStatus error:", error);
    res.status(500).json({ message: "Failed to update booking status", error: error.message });
  }
};

// ---------- POST check availability (date + time window) ----------
const checkAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date) return res.status(400).json({ message: "Date is required" });
    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Start and end times are required" });
    }
    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      return res.status(400).json({ message: "Invalid time format (use HH:mm 24h)" });
    }
    const s = toMinutes(startTime);
    const e = toMinutes(endTime);
    if (!(s < e)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const d0 = new Date(date);
    d0.setHours(0, 0, 0, 0);
    const d1 = new Date(d0);
    d1.setDate(d1.getDate() + 1);

    const bookings = await Crematorium.find({
      cremationDate: { $gte: d0, $lt: d1 },
    }).select("_id startTime endTime");

    const clash = bookings.some((b) =>
      timeRangesOverlap(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
    );

    if (clash) {
      return res.json({
        available: false,
        message: "❌ That time window is already booked",
      });
    }

    res.json({ available: true, message: "✅ Time window is available" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllCrematoriumBookings,
  addCrematoriumBooking,
  updateCrematoriumBookingStatus,
  checkAvailability,
};
