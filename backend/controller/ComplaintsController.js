const Complaint = require("../Model/ComplaintsModel");

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }); // Most recent first
    
    if (!complaints || complaints.length === 0) {
      return res.status(200).json({ 
        success: true,
        complaints: [],
        message: "No complaints found" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      complaints,
      count: complaints.length 
    });
  } catch (err) {
    console.error("Get complaints error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
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
    status = 'pending' // Default status
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
      status
    });

    const savedComplaint = await complaint.save();
    
    console.log("New complaint created:", savedComplaint._id);
    
    res.status(201).json({ 
      success: true,
      complaint: savedComplaint,
      message: "Complaint created successfully"
    });
  } catch (err) {
    console.error("Add complaint error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: "Complaint not found" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      complaint 
    });
  } catch (err) {
    console.error("Get complaint by ID error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Update complaint - FIXED VERSION FOR STATUS UPDATES
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    console.log(`Updating complaint ${id} with:`, updateData);

    // Handle file uploads if they exist
    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map((file) => file.filename);
      updateData.Attach_Files = filePaths;
    }

    // Remove undefined values to avoid overriding existing data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true, // Run schema validation
        upsert: false // Don't create if doesn't exist
      }
    );

    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: "Complaint not found" 
      });
    }

    console.log(`Complaint ${id} updated successfully. New status:`, complaint.status);

    res.status(200).json({ 
      success: true,
      complaint,
      message: 'Complaint updated successfully'
    });

  } catch (err) {
    console.error('Update complaint error:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to update complaint",
      error: err.message 
    });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndDelete(id);
    
    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: "Complaint not found" 
      });
    }
    
    console.log(`Complaint ${id} deleted successfully`);
    
    res.status(200).json({ 
      success: true,
      message: "Complaint deleted successfully", 
      complaint 
    });
  } catch (err) {
    console.error("Delete complaint error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete complaint",
      error: err.message 
    });
  }
};

// Get complaints by status (Optional helper function)
const getComplaintsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'resolved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, resolved, or rejected"
      });
    }
    
    const complaints = await Complaint.find({ status }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      complaints,
      count: complaints.length,
      status
    });
  } catch (err) {
    console.error("Get complaints by status error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Bulk status update (Optional helper function)
const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    const validStatuses = ['pending', 'resolved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "IDs array is required"
      });
    }
    
    const result = await Complaint.updateMany(
      { _id: { $in: ids } },
      { status },
      { runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} complaints to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Bulk update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = {
  getAllComplaints,
  addComplaint,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByStatus, // Optional
  bulkUpdateStatus // Optional
};