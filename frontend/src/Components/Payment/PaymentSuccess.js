import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';
import './PaymentPage.css';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    if (paymentIntentId) {
      verifyPayment(paymentIntentId);
    } else {
      setError('Payment information not found');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (paymentIntentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/payment/payment-status/${paymentIntentId}`);
      setPaymentStatus(response.data);
      
      if (response.data.status === 'succeeded') {
        // Payment successful වැගේම database එකට save කරන්න
        // මෙතන real data එක pass කරන්න ඕනෙ
        await axios.post('http://localhost:5000/api/payment/save-payment', {
          paymentIntentId: paymentIntentId,
          amount: response.data.amount,
          shopName: 'Sample Shop', // Real data එකෙන් ගන්න ඕනෙ
          applicantName: 'John Doe', // Real data එකෙන් ගන්න ඕනෙ
          nicNumber: '123456789V' // Real data එකෙන් ගන්න ඕනෙ
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment status');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Payment verification කරමින්...</p>
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
            <h2>⚠️ Verification Error</h2>
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
        {paymentStatus?.status === 'succeeded' ? (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h1 className="success-title">Payment Successful!</h1>
            <div className="success-message">
              <p>🎉 ඔබේ rent payment සාර්ථකව complete වුනා!</p>
              <p><strong>Amount Paid:</strong> Rs. {paymentStatus.amount?.toLocaleString()}</p>
              <p><strong>Currency:</strong> {paymentStatus.currency?.toUpperCase()}</p>
              <p><strong>Status:</strong> Completed</p>
            </div>
            <button 
              onClick={() => navigate('/my-applications')} 
              className="success-btn"
            >
              🏠 Back to My Applications
            </button>
          </div>
        ) : (
          <div className="payment-error">
            <div className="error-container">
              <h2>❌ Payment Failed</h2>
              <p>Your payment was not completed successfully.</p>
              <p><strong>Status:</strong> {paymentStatus?.status}</p>
              <button onClick={() => navigate('/pay')} className="back-btn">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;