import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm';
import Nav from '../Nav/Nav';
import './PaymentPage.css';

// Stripe initialize
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Default data (real app should fetch this from backend or application state)
  const defaultPaymentData = {
    amount: 5000,
    shopName: 'Sample Shop',
    applicantName: 'John Doe',
    nicNumber: '123456789V'
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const shopName = urlParams.get('shopName') || defaultPaymentData.shopName;
    const applicantName = urlParams.get('applicantName') || defaultPaymentData.applicantName;
    const amount = parseInt(urlParams.get('amount')) || defaultPaymentData.amount;
    const nicNumber = urlParams.get('nicNumber') || defaultPaymentData.nicNumber;

    const data = { amount, shopName, applicantName, nicNumber };
    setPaymentData(data);
    createPaymentIntent(data);
  }, [location]);

  const createPaymentIntent = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: data.amount,
        currency: 'lkr',
        shopName: data.shopName,
        applicantName: data.applicantName
      });

      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
      setLoading(false);
    } catch (error) {
      console.error('Payment Intent Error:', error);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log('Saving payment with data:', {
        paymentIntentId,
        ...paymentData
      });

      // ✅ Let backend set status & paymentPeriod
      const saveResponse = await axios.post('http://localhost:5000/api/payment/save-payment', {
        paymentIntentId,
        amount: paymentData.amount,
        shopName: paymentData.shopName,
        applicantName: paymentData.applicantName,
        nicNumber: paymentData.nicNumber
      });

      console.log('Payment save response:', saveResponse.data);

      alert('🎉 Payment successful! Your rent has been paid.');
      navigate('/my-applications');
    } catch (error) {
      console.error('Save payment error:', error);
      console.error('Error details:', error.response?.data);

      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`Payment completed but failed to save record: ${errorMessage}. Please contact support.`);

      navigate('/my-applications');
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#007bff',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px'
    }
  };

  const options = { clientSecret, appearance };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Payment setup කරමින්...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="payment-error">
          <div className="error-container">
            <h2>⚠️ Payment Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/my-applications')} className="back-btn">
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="payment-page">
        <div className="payment-header">
          <h1>💳 Shop Rent Payment</h1>
          <p>ඔබේ shop එකේ rent payment කරන්න</p>
        </div>

        {clientSecret && paymentData && (
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm
              amount={paymentData.amount}
              shopName={paymentData.shopName}
              applicantName={paymentData.applicantName}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}

        <div className="payment-footer">
          <button 
            onClick={() => navigate('/my-applications')} 
            className="cancel-btn"
          >
            ← Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
