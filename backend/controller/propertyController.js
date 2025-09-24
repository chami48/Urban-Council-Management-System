const Property = require("../Model/propertyModel");

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
    console.log("Request body:", req.body);

    if (!req.body.branch || !req.body.division || !req.body.street || !req.body.propertyNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = new Property(req.body);
    await property.save();

    console.log("Property created:", property);
    res.status(201).json({ property });

  } catch (err) {
    console.error("Error in addProperty:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Property with this number already exists",
        field: Object.keys(err.keyPattern)[0],
      });
    }

    res.status(500).json({
      message: "Unable to add property",
      error: err.message,
    });
  }
};

// Get property by propertyNo
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

// Get property by Mongo ID
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

// Delete property by Mongo ID
const deleteProperty = async (req, res) => {
  try {
    console.log("Deleting property with ID:", req.params.id);
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Unable to delete property" });
    }
    res.status(200).json({ message: "Property deleted", property });
  } catch (err) {
    console.error("Error in deleteProperty:", err);
    res.status(500).json({ message: "Error deleting property" });
  }
};

// ✅ Delete property by propertyNo
const deletePropertyByNo = async (req, res) => {
  try {
    console.log("Deleting property with propertyNo:", req.params.propertyNo);
    const property = await Property.findOneAndDelete({ propertyNo: req.params.propertyNo });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted", property });
  } catch (err) {
    console.error("Error in deletePropertyByNo:", err);
    res.status(500).json({ message: "Error deleting property", error: err.message });
  }
};

module.exports = {
  getAllProperties,
  addProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyByPropertyNo,
  deletePropertyByNo,   
};
