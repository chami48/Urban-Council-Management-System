import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './PaymentForm.css';

const PaymentForm = ({ amount, shopName, applicantName, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
        onError && onError(error.message);
      } else {
        setMessage('An unexpected error occurred.');
        onError && onError('An unexpected error occurred.');
      }
    } else {
      // Payment succeeded
      setMessage('Payment succeeded!');
      onSuccess && onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <div className="payment-form-container">
      <div className="payment-summary">
        <h3>💰 Payment Summary</h3>
        <div className="summary-details">
          <p><strong>Shop Name:</strong> {shopName}</p>
          <p><strong>Applicant:</strong> {applicantName}</p>
          <p><strong>Rent Amount:</strong> Rs. {amount.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
        
        <button 
          disabled={isLoading || !stripe || !elements} 
          className="pay-button"
        >
          <span>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              `💳 Pay Rs. ${amount.toLocaleString()}`
            )}
          </span>
        </button>
        
        {message && (
          <div className={`payment-message ${message.includes('succeeded') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
