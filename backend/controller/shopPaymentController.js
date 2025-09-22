const ShopApplication = require("../Model/ShopApplicationModel");
const Payment = require("../Model/Payment");

// ✅ Get shop details for payment page
exports.getShopPaymentDetails = async (req, res) => {
  try {
    const shop = await ShopApplication.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    res.status(200).json({
      applicantName: shop.applicantName,
      nicNumber: shop.nicNumber,
      phone: shop.phone,
      email: shop.email,
      shopName: shop.shopName,
      shopNo: shop.shopNo,
      shopAddress: shop.shopAddress,
      requestedRent: shop.requestedRent,
      leaseDuration: shop.leaseDuration
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching shop details", error: err.message });
  }
};

// ✅ Get payment history by ShopId
exports.getPaymentsByShop = async (req, res) => {
  try {
    const shop = await ShopApplication.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const payments = await Payment.findByShop(shop.shopName);
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
};
