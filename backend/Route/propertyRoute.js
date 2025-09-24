const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");

// Get all properties
router.get("/", propertyController.getAllProperties);

// Add new property
router.post("/", propertyController.addProperty);

// Get property by Mongo ID
router.get("/:id", propertyController.getPropertyById);

// Update property by Mongo ID
router.put("/:id", propertyController.updateProperty);

// Delete property by propertyNo
router.delete("/propertyNo/:propertyNo", propertyController.deletePropertyByNo);

// Delete property by Mongo ID
router.delete("/:id", propertyController.deleteProperty);

// Get property by propertyNo
router.get("/propertyNo/:propertyNo", propertyController.getPropertyByPropertyNo);

module.exports = router;
