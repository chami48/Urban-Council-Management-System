// backend/controller/InventoryLogControllers.js
const InventoryLog = require("../Model/InventoryLogModel");

// GET /inventory-logs
const getAllLogs = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      InventoryLog.find({})
        .sort({ changedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      InventoryLog.countDocuments({}),
    ]);

    return res.status(200).json({
      logs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch inventory logs" });
  }
};

module.exports = { getAllLogs };
