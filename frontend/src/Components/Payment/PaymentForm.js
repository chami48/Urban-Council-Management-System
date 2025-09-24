// src/Components/Payment/PaymentForm.js
import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./PaymentForm.css";

const PaymentForm = ({ payment, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
        onError && onError(error.message);
      } else {
        setMessage("Payment succeeded!");
        onSuccess && onSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred.");
      onError && onError("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

 const {
  amount = 0,
  applicantName = "",
  paymentType = "",
  shopName = "",
  shopNo = "",
  propertyNo = "",
  year = "",
  quarter = ""
} = payment || {};


  return (
    <div className="payment-form-container">
      {/* =====================
          Dynamic Header Info
      ====================== */}
      {paymentType === "property_tax" && (
        <div className="payment-info">
          <h3>🏠 Property Tax Payment</h3>
          <p><strong>Applicant:</strong> {applicantName}</p>
          <p><strong>Property No:</strong> {propertyNo}</p>
          <p><strong>Year:</strong> {year} | <strong>Quarter:</strong> {quarter}</p>
        </div>
      )}

      {paymentType === "shop_rent" && (
        <div className="payment-info">
          <h3>🏬 Shop Rent Payment</h3>
          <p><strong>Applicant:</strong> {applicantName}</p>
          <p><strong>Shop Name:</strong> {shopName}</p>
          <p><strong>Shop Number:</strong> {shopNo}</p>
        </div>
      )}

      {/* =====================
          Stripe Payment Form
      ====================== */}
      <form onSubmit={handleSubmit} className="payment-form">
        <PaymentElement options={{ layout: "tabs" }} />
        <button disabled={isLoading || !stripe || !elements} className="pay-button">
          <span>
            {isLoading ? <div className="spinner"></div> : `💳 Pay Rs. ${amount?.toLocaleString()}`}
          </span>
        </button>

        {message && (
          <div className={`payment-message ${message.includes("succeeded") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
