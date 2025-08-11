const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");

router.get("/", propertyController.getAllProperties);
router.post("/", propertyController.addProperty);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
