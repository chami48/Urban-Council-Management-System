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
    const property = new Property(req.body);
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Add property error:", err); // Log full error
    res.status(500).json({ 
      message: "Unable to add property", 
      error: err.message,
      errors: err.errors  // for mongoose validation errors
    });
  }
};
const getPropertiesByFilter = async (filter) => {
  try {
    const properties = await Property.find(filter);
    return properties;
  } catch (err) {
    throw err;
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
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: "Unable to delete property" });
        res.status(200).json({ property });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting property" });
    }
};

module.exports = {
    getAllProperties,
    addProperty,
    getPropertyById,
    updateProperty,
    deleteProperty
};
