const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessmentController");

router.get("/", assessmentController.getAllAssessments);
router.post("/", assessmentController.addAssessment);
router.get("/:id", assessmentController.getAssessmentById);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/:id", assessmentController.deleteAssessment);
router.get('/propertyNo/:propertyNo', assessmentController.getAssessmentByPropertyNo);

module.exports = router;
