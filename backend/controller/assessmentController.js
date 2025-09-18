const Assessment = require("../Model/assessmentModel");

// Get all assessments
const getAllAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json({ assessments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Add new assessment
const addAssessment = async (req, res) => {
    try {
        const assessment = new Assessment(req.body);
        await assessment.save();
        res.status(201).json({ assessment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to add assessment" });
    }
};

const getAssessmentByPropertyNo = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ propertyNo: req.params.propertyNo });
    if (!assessment) return res.status(200).json({ assessment: null }); // no assessment found
    res.status(200).json({ assessment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assessment" });
  }
};


// Get assessment by ID
const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) return res.status(404).json({ message: "Assessment not found" });
        res.status(200).json({ assessment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching assessment" });
    }
};

// Update assessment
const updateAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!assessment) return res.status(404).json({ message: "Unable to update assessment" });
        res.status(200).json({ assessment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating assessment" });
    }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndDelete(req.params.id);
        if (!assessment) return res.status(404).json({ message: "Unable to delete assessment" });
        res.status(200).json({ assessment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting assessment" });
    }
};

module.exports = {
    getAllAssessments,
    addAssessment,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    getAssessmentByPropertyNo
};