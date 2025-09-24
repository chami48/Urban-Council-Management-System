const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Payment = require('../Model/Payment');
const Assessment = require('../Model/AssessmentModel');

// 🔄 Map Stripe status → Your DB enum
function mapStripeStatus(stripeStatus) {
  switch (stripeStatus) {
    case 'succeeded':
      return 'completed';
    case 'processing':
      return 'pending';
    case 'canceled':
      return 'failed';
    default:
      return stripeStatus;
  }
}

// ✅ Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const {
      amount,
      currency = 'lkr',
      applicantName,
      paymentType,
      shopName,
      propertyNo,
      year,
      quarter
    } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata: {
        applicant_name: applicantName,
        payment_type: paymentType,
        ...(paymentType === 'shop_rent' && { shop_name: shopName }),
        ...(paymentType === 'property_tax' && { property_no: propertyNo, year, quarter })
      },
      automatic_payment_methods: { enabled: true }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Check Payment Status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.send({
      status: mapStripeStatus(paymentIntent.status),
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Save Payment in DB
router.post('/save-payment', async (req, res) => {
  try {
    const {
      paymentIntentId,
      amount,
      applicantName,
      nicNumber,
      paymentType,
      shopName,
      propertyNo,
      year,
      quarter,
      stripeStatus = 'succeeded',
      applicationId
    } = req.body;

    // Avoid duplicates
    const existingPayment = await Payment.findOne({ paymentIntentId });
    if (existingPayment) {
      return res.send({ message: 'Payment already recorded', payment: existingPayment });
    }

    const currentDate = new Date();
    const payment = new Payment({
      paymentIntentId,
      amount,
      amountPaid: amount,
      applicantName,
      nicNumber,
      paymentType,
      status: mapStripeStatus(stripeStatus),
      applicationId, // link to application if available
      paymentDate: currentDate,
      paymentPeriod: { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
      ...(paymentType === 'shop_rent' && { shopName }),
      ...(paymentType === 'property_tax' && { propertyNo, year, quarter })
    });

    await payment.save();

    res.send({
      message: 'Payment saved successfully',
      payment,
      receiptNumber: payment.receiptNumber
    });
  } catch (error) {
    console.error('Save Payment Error:', error);
    res.status(500).send({
      error: error.message,
      details: error.errors || 'No additional details available'
    });
  }
});

// ✅ Get full payment details by paymentIntentId
router.get('/details/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const payment = await Payment.findOne({ paymentIntentId });

    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }

    res.send(payment);
  } catch (error) {
    console.error('Payment Details Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Get payment history by applicationId
router.get('/history/application/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const payments = await Payment.find({ applicationId: appId }).sort({ paymentDate: -1 });
    res.send(payments);
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Get payment history by NIC
router.get('/history/:nicNumber', async (req, res) => {
  try {
    const { nicNumber } = req.params;
    const payments = await Payment.findByNIC(nicNumber);
    res.send(payments);
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Get payment statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Payment.getPaymentStats();
    res.send(stats);
  } catch (error) {
    console.error('Payment Stats Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Get quarterly property tax (handles propertyNo with "/")
router.get('/payments/:part1/:part2/quarterly/:year/:quarter', async (req, res) => {
  try {
    const { part1, part2, year, quarter } = req.params;
    const propertyNo = `${part1}/${part2}`;

    const assessment = await Assessment.findOne({ propertyNo });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const annualTax = (assessment.appraisedValue * assessment.taxRate) / 100;
    const quarterlyAmount = annualTax / 4;

    res.json({
      propertyNo,
      year,
      quarter,
      ownerName: assessment.ownerName,
      ownerNIC: assessment.ownerNIC,
      quarterlyAmount,
    });
  } catch (err) {
    console.error("Quarterly payment fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
