// backend/Route/InventoryLogRoute.js
const express = require("express");
const router = express.Router();
const { getAllLogs } = require("../controller/InventoryLogControllers");
const { requireAuth, allowRoles } = require("../middleware/authz");

router.use(requireAuth);

// Only admin & inventoryOfficer can view logs
router.get("/", allowRoles("admin", "inventoryOfficer"), getAllLogs);

module.exports = router;
