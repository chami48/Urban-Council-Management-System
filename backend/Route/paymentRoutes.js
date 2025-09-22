const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Payment = require('../Model/Payment');

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
      return stripeStatus; // fallback
  }
}

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'lkr', shopName, applicantName } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency,
      metadata: {
        shop_name: shopName,
        applicant_name: applicantName,
        payment_type: 'shop_rent'
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

// Check Payment Status
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

// Save Payment to DB
router.post('/save-payment', async (req, res) => {
  try {
    const { paymentIntentId, amount, shopName, applicantName, nicNumber, paymentType = 'shop_rent', stripeStatus = 'succeeded' } = req.body;

    console.log('Received payment data:', req.body);

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ paymentIntentId });
    if (existingPayment) {
      return res.send({
        message: 'Payment already recorded',
        payment: existingPayment
      });
    }

    const currentDate = new Date();
    const payment = new Payment({
      paymentIntentId,
      amount,
      amountPaid: amount,
      shopName,
      applicantName,
      nicNumber,
      paymentDate: currentDate,
      status: mapStripeStatus(stripeStatus),
      paymentType,
      paymentPeriod: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      }
    });

    console.log('Attempting to save payment:', payment);

    await payment.save();

    console.log('Payment saved successfully:', payment);

    res.send({
      message: 'Payment saved successfully',
      payment,
      receiptNumber: payment.receiptNumber
    });
  } catch (error) {
    console.error('Save Payment Error:', error);
    if (error.errors) {
      for (const [field, err] of Object.entries(error.errors)) {
        console.error(`Field ${field}:`, err.message);
      }
    }
    res.status(500).send({
      error: error.message,
      details: error.errors || 'No additional details available'
    });
  }
});

// Get payment history by NIC
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

// Get payment statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Payment.getPaymentStats();
    res.send(stats);
  } catch (error) {
    console.error('Payment Stats Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
