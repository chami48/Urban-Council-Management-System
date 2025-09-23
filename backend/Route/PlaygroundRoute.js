const express = require("express");
const router = express.Router();

const Playground = require("../Model/PlaygroundModel");
const controller = require("../controller/PlaygroundController");

//new sanuk
const requireAuth = require("../middleware/requireAuth");

/**
 * ✅ Availability check
 * POST /playgrounds/check-availability
 * Body: { date: string(ISO | yyyy-mm-dd), playgroundType?: string }
 * - Matches the entire day (00:00–23:59:59.999)
 * - Optionally filters by playgroundType
 */
router.post("/check-availability", async (req, res) => {
  try {
    const { date, playgroundType } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);

    const query = { eventDate: { $gte: start, $lt: end } };
    if (playgroundType) query.playgroundType = playgroundType;

    const existing = await Playground.findOne(query).lean();

    if (existing) {
      return res.json({
        available: false,
        message: "❌ Playground already booked for this date",
        bookingId: existing._id,
      });
    }

    return res.json({
      available: true,
      message: "✅ Playground available for booking",
    });
  } catch (err) {
    console.error("check-availability error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Status update
 * PATCH /playgrounds/update-status/:id
 * Body: { action: "approve" | "reject", comment?: string }
 */
router.patch("/update-status/:id", controller.updateBookingStatus);

/**
 * ✅ CRUD
 * GET    /playgrounds
 * POST   /playgrounds
 * GET    /playgrounds/:id
 * PUT    /playgrounds/:id
 * DELETE /playgrounds/:id
 */
router.get("/", controller.getAllPlaygrounds);
router.post("/",requireAuth, controller.createPlayground);
router.get("/:id", controller.getPlaygroundById);
router.put("/:id", requireAuth,controller.updatePlayground);
router.delete("/:id", controller.deletePlayground);

module.exports = router;
