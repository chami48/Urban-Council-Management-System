
const Property = require("../models/propertyModel");

// Get all properties
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json({ properties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Add new property
const addProperty = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    
    // Validate required fields
    if (!req.body.branch || !req.body.division || !req.body.street || !req.body.propertyNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = new Property(req.body);
    await property.save();
    
    console.log("Property created:", property); // Debug log
    res.status(201).json({ property });
    
  } catch (err) {
    console.error("Error in addProperty:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Property with this number already exists",
        field: Object.keys(err.keyPattern)[0]
      });
    }
    
    res.status(500).json({ 
      message: "Unable to add property",
      error: err.message 
    });
  }
};

const getPropertyByPropertyNo = async (req, res) => {
  try {
    const property = await Property.findOne({ propertyNo: req.params.propertyNo });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching property" });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.status(200).json({ property });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching property" });
    }
};

// Update property
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!property) return res.status(404).json({ message: "Unable to update property" });
        res.status(200).json({ property });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating property" });
    }
};

// Delete property
const deleteProperty = async (req, res) => {
    try {
        console.log("Deleting property with ID:", req.params.id); // Debug log
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            console.log("Property not found"); // Debug log
            return res.status(404).json({ message: "Unable to delete property" });
        }
        console.log("Property deleted:", property); // Debug log
        res.status(200).json({ property });
    } catch (err) {
        console.error("Error in deleteProperty:", err);
        res.status(500).json({ message: "Error deleting property" });
    }
};

module.exports = {
    getAllProperties,
    addProperty,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertyByPropertyNo
};
