const express = require('express');
const router = express.Router();
const User =  require("../Model/UserModel");
const UserControler = require("../controller/UserControler");

// ✅ Existing routes
router.get("/",UserControler.getAllUsers);
router.post("/",UserControler.addUsers);
router.get("/:id",UserControler.getById);
router.put("/:id",UserControler.updateUser);
router.delete("/:id",UserControler.deleteUser);
router.patch("/update-status/:id", UserControler.updateBookingStatus);

// ✅ New availability check route
router.post("/check-availability", async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existingBooking = await User.findOne({ eventDate: new Date(date) });

    if (existingBooking) {
      return res.json({ available: false, message: "❌ Playground already booked for this date" });
    }

    res.json({ available: true, message: "✅ Playground available for booking" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
