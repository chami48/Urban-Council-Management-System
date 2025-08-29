const Crematorium = require("../Model/Crematorium");
const path = require("path");

// Get all crematorium bookings
const getAllCrematoriumBookings = async (req, res) => {
  try {
    const bookings = await Crematorium.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// Add new crematorium booking
const addCrematoriumBooking = async (req, res) => {
  try {
    const { files, body } = req;

    // Validate required fields
    const requiredFields = [
      "applicantFullName",
      "surname",
      "nic",
      "deceasedFullName",
      "dateOfDeath",
      "cremationDate",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (body.declarationAgreement !== "true") {
      return res.status(400).json({
        success: false,
        message: "You must agree to the declaration",
      });
    }

    const deathCertFile = files?.deathCertificateImage?.[0];
    if (!deathCertFile) {
      return res.status(400).json({
        success: false,
        message: "Death certificate image is required",
      });
    }

    // Convert absolute paths to relative paths for storing in DB
    const deathCertificateImagePath = path
      .relative(path.join(__dirname, "../"), deathCertFile.path)
      .replace(/\\/g, "/");

    const beOrderImagePath = files?.beOrderImage?.[0]
      ? path
          .relative(path.join(__dirname, "../"), files.beOrderImage[0].path)
          .replace(/\\/g, "/")
      : null;

    const bookingData = {
      ...body,
      dateOfDeath: new Date(body.dateOfDeath),
      cremationDate: new Date(body.cremationDate),
      declarationAgreement: true,
      deathCertificateImage: deathCertificateImagePath,
      beOrderImage: beOrderImagePath,
    };

    const booking = new Crematorium(bookingData);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Crematorium booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

// Update crematorium booking status
const updateCrematoriumBookingStatus = async (req, res) => {
  const id = req.params.id;
  const { approve, reject, comment } = req.body;

  try {
    const booking = await Crematorium.findByIdAndUpdate(
      id,
      {
        approve,
        reject,
        comment,
        statusUpdatedAt: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let status = null;
    if (approve === true) status = "Approved";
    else if (reject === true) status = "Rejected";

    // If you have email sending setup, you can send status email here (optional)

    res.status(200).json({
      message: "Crematorium booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCrematoriumBookings,
  addCrematoriumBooking,
  updateCrematoriumBookingStatus,
};
