const express = require("express");
const router = express.Router();
const licenseCtrl = require("../controller/licenseController");

router.patch("/approve/:id", licenseCtrl.approveBusiness);
router.get("/mine", licenseCtrl.myLicenses);
router.post("/issue/:id", licenseCtrl.issueLicense);

module.exports = router;
