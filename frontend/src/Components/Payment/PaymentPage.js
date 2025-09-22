// src/Components/Payment/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm';
import Nav from '../Nav/Nav';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentType = urlParams.get('paymentType');
    const shopId = urlParams.get('shopId');
    const propertyNo = urlParams.get('propertyNo');
    const year = urlParams.get('year');
    const quarter = urlParams.get('quarter');

    const fetchData = async () => {
      try {
        let data;

        // 🏬 Shop Rent Payment
        if (paymentType === 'shop_rent' && shopId) {
          const res = await axios.get(`http://localhost:5000/api/shop-payment/${shopId}`);
          data = {
            ...res.data,
            paymentType,
            amount: res.data.requestedRent,
            applicationId: shopId
          };
        }

        // 🏠 Property Tax Payment
        if (paymentType === 'property_tax' && propertyNo && year && quarter) {
          const res = await axios.get(
            `http://localhost:5000/api/payment/payments/${propertyNo}/quarterly/${year}/${quarter}`
          );
          data = {
            paymentType,
            amount: res.data.quarterlyAmount,
            applicantName: res.data.ownerName,
            nicNumber: res.data.ownerNIC,
            propertyNo,
            year,
            quarter
          };
        }

        if (!data) throw new Error('Invalid payment request');

        setPaymentData(data);

        const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
          amount: data.amount,
          currency: 'lkr',
          shopName: data.shopName,
          applicantName: data.applicantName
        });

        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to fetch payment details');
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  // ✅ Handle Payment Success
  const handlePaymentSuccess = async (intentId) => {
    try {
      await axios.post('http://localhost:5000/api/payment/save-payment', {
        paymentIntentId: intentId,
        ...paymentData
      });

      alert('🎉 Payment successful!');

      if (paymentData.paymentType === 'shop_rent') {
        navigate('/my-applications'); // 🏬 Shop Rent → My Applications
      } else if (paymentData.paymentType === 'property_tax') {
        navigate(`/payment-success?paymentType=property_tax`); // 🏠 Property Tax → Success Page
      } else {
        navigate('/'); // fallback
      }
    } catch (error) {
      console.error('Save payment error:', error);
      alert('Payment completed but failed to save record.');

      if (paymentData.paymentType === 'shop_rent') {
        navigate('/my-applications');
      } else if (paymentData.paymentType === 'property_tax') {
        navigate(`/payment-success?paymentType=property_tax`);
      } else {
        navigate('/');
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <p style={{ textAlign: 'center', padding: '3rem' }}>Payment setup කරමින්...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <p style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      {clientSecret && paymentData && (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <PaymentForm
            payment={paymentData}
            onSuccess={handlePaymentSuccess}
            onError={setError}
          />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
