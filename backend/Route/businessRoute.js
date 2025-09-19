const express = require("express");
const router = express.Router();
const { upload } = require("./uploadRoute");
const businessCtrl = require("../controller/businessController");
const inspectionCtrl = require("../controller/inspectionController");

router.post(
  "/apply",
  upload.fields([
    { name: "businessReg", maxCount: 1 },
    { name: "phiRequest", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 },
    { name: "nicCopy", maxCount: 1 }
  ]),
  businessCtrl.applyBusiness
);

router.get("/phi/pending", businessCtrl.listForPHI);
router.get("/officer/pending", businessCtrl.listForOfficer);
router.patch("/:id/inspection", inspectionCtrl.inspectBusiness);

// ✅ New route for single business
router.get("/:id", businessCtrl.getBusinessById);

module.exports = router;
