const Payment = require("../Model/paymentModel");
const Assessment = require("../Model/assessmentModel");


// ------------------ Property Tax ------------------ //
const addPayment = async (req, res) => {
  try {
    const { propertyNo, year, quarter, amountPaid, method } = req.body;

    const assessment = await Assessment.findOne({ propertyNo });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found for this property" });
    }

    const payment = new Payment({ propertyNo, year, quarter, amountPaid, method });
    await payment.save();

    res.status(201).json({ message: "✅ Property tax payment recorded", payment });
  } catch (err) {
    console.error("❌ Error adding payment:", err);
    res.status(500).json({ message: "Server error while recording payment" });
  }
};

const getPaymentsByProperty = async (req, res) => {
  try {
    const { propertyNo } = req.params;
    const payments = await Payment.find({ propertyNo }).sort({ paymentDate: -1 });
    res.status(200).json({ payments });
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ message: "Server error while fetching payments" });
  }
};

const getTotalPaidForYear = async (req, res) => {
  try {
    const { propertyNo, year } = req.params;
    const result = await Payment.aggregate([
      { $match: { propertyNo, year: parseInt(year) } },
      { $group: { _id: null, totalPaid: { $sum: "$amountPaid" } } }
    ]);
    const totalPaid = result.length > 0 ? result[0].totalPaid : 0;
    res.status(200).json({ propertyNo, year, totalPaid });
  } catch (err) {
    console.error("❌ Error calculating total paid:", err);
    res.status(500).json({ message: "Server error while calculating total paid" });
  }
};

module.exports = {
  addPayment,
  getPaymentsByProperty,
  getTotalPaidForYear,
};
