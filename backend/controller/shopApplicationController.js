const ShopApplication = require("../Model/ShopApplicationModel");
const Shop = require("../Model/shopModel");   // ✅ Added import

// ✅ Citizen submits application
const applyForShop = async (req, res) => {
  try {
    const application = new ShopApplication({
      ...req.body,
      documents: req.files.map(file => file.path) // ✅ save uploaded paths
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Officer: view all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await ShopApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Officer: view only pending applications
const getPendingApplications = async (req, res) => {
  try {
    const applications = await ShopApplication.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Officer approves application
const approveShop = async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "approved";
    await application.save();

    // Create actual Shop entry
    const newShop = new Shop({
      shopNo: application.shopNo,
      tenantName: application.applicantName,
      monthlyRent: application.requestedRent
    });
    await newShop.save();

    res.json({ message: "Shop approved & registered", shop: newShop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Officer rejects application
const rejectShop = async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "rejected";
    await application.save();

    res.json({ message: "Application rejected", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  applyForShop,
  getAllApplications,
  getPendingApplications,
  approveShop,
  rejectShop
};
