const Payment = require("../Model/Payment");

// 🔄 Map Stripe status → DB status
function mapStripeStatus(stripeStatus) {
  switch (stripeStatus) {
    case "succeeded": return "completed";
    case "processing": return "pending";
    case "canceled": return "failed";
    default: return "pending";
  }
}

// ✅ Unified Save Payment
const savePayment = async (req, res) => {
  try {
    const {
      paymentIntentId,
      amount,
      applicantName,
      nicNumber,
      shopName,
      propertyNo,
      year,
      quarter,
      licenseType,
      fineReason,
      paymentType = "other",
      stripeStatus = "succeeded"
    } = req.body;

    // avoid duplicate Stripe payments
    if (paymentIntentId) {
      const existingPayment = await Payment.findOne({ paymentIntentId });
      if (existingPayment) {
        return res.json({ message: "Payment already recorded", payment: existingPayment });
      }
    }

    const currentDate = new Date();

    const payment = new Payment({
      paymentIntentId,
      amount,
      amountPaid: amount,
      applicantName,
      nicNumber,
      shopName,
      propertyNo,
      year,
      quarter,
      licenseType,
      fineReason,
      paymentDate: currentDate,
      status: mapStripeStatus(stripeStatus),
      paymentType,
      paymentPeriod: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      }
    });

    await payment.save();
    res.json({
      message: "✅ Payment saved successfully",
      payment,
      receiptNumber: payment.receiptNumber
    });

  } catch (err) {
    console.error("❌ Error saving payment:", err);
    res.status(500).json({ error: err.message });
  }
};

// Payment history by NIC
const getHistoryByNIC = async (req, res) => {
  try {
    const payments = await Payment.findByNIC(req.params.nicNumber);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stats
const getStats = async (req, res) => {
  try {
    const stats = await Payment.getPaymentStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  savePayment,
  getHistoryByNIC,
  getStats
};
