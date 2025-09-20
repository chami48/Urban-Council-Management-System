// backend/Route/InventoryRoute.js
const express = require("express");
const router = express.Router();
const Inv = require("../controller/InventoryControllers");
const { requireAuth, allowRoles } = require("../middleware/authz");

// Option A: auth once for whole router, then per-route roles:
router.use(requireAuth);

router.get("/",     allowRoles("admin", "inventoryOfficer"), Inv.getAllItems);
router.get("/low",  allowRoles("admin", "inventoryOfficer"), Inv.getLowStock);
router.get("/:id",  allowRoles("admin", "inventoryOfficer"), Inv.getById);
router.post("/",    allowRoles("admin", "inventoryOfficer"), Inv.addItem);
router.put("/:id",  allowRoles("admin", "inventoryOfficer"), Inv.updateItem);
router.delete("/:id", allowRoles("admin", "inventoryOfficer"), Inv.deleteItem);

module.exports = router;
