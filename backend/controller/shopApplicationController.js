const ShopApplication = require("../Model/ShopApplicationModel");
const Shop = require("../Model/shopModel");

// ✅ Citizen submits application
const applyForShop = async (req, res) => {
  try {
    const application = new ShopApplication({
      ...req.body,
      documents: req.files?.map(file => file.path) || []
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await ShopApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get pending applications
const getPendingApplications = async (req, res) => {
  try {
    const applications = await ShopApplication.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update application (only if pending)
const updateApplication = async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.status !== "pending") {
      return res.status(400).json({ message: "Only pending applications can be updated" });
    }

    Object.assign(application, req.body);

    if (req.files && req.files.length > 0) {
      application.documents = req.files.map(file => file.path);
    }

    await application.save();
    res.json({ message: "Application updated successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete application (only if pending)
const deleteApplication = async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.status !== "pending") {
      return res.status(400).json({ message: "Only pending applications can be deleted" });
    }

    await ShopApplication.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted successfully" });
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
  getApplicationById,
  updateApplication,
  deleteApplication,
  approveShop,
  rejectShop
};
