const Complaint = require("../Model/ComplaintsModel");

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    if (!complaints) {
      return res.status(404).json({ message: "Complaints not found" });
    }
    res.status(200).json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add complaint
const addComplaint = async (req, res) => {
  const {
    NatureofComplaint,
    Name,
    NIC_Number,
    Email,
    Phone_Number,
    Address,
    Location,
    Grama_Niladhari_Division,
    Description,
  } = req.body;

  const filePaths = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const complaint = new Complaint({
      NatureofComplaint,
      Name,
      NIC_Number,
      Email,
      Phone_Number,
      Address,
      Location,
      Grama_Niladhari_Division,
      Attach_Files: filePaths,
      Description,
    });

    await complaint.save();
    res.status(201).json({ complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json({ complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update complaint
const updateComplaint = async (req, res) => {
  const {
    NatureofComplaint,
    Name,
    NIC_Number,
    Email,
    Phone_Number,
    Address,
    Location,
    Grama_Niladhari_Division,
    Description,
  } = req.body;

  const filePaths = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        NatureofComplaint,
        Name,
        NIC_Number,
        Email,
        Phone_Number,
        Address,
        Location,
        Grama_Niladhari_Division,
        Attach_Files: filePaths.length ? filePaths : undefined,
        Description,
      },
      { new: true }
    );

    if (!complaint)
      return res.status(404).json({ message: "Unable to update complaint" });

    res.status(200).json({ complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Unable to delete complaint" });
    res.status(200).json({ message: "Complaint deleted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllComplaints,
  addComplaint,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
