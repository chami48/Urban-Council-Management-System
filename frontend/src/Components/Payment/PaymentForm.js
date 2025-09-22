// src/Components/Payment/PaymentForm.js
import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

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
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
        onError && onError(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded!");
        onSuccess && onSuccess(paymentIntent.id);
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
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        
        {/* =====================
            Dynamic Header Info
        ====================== */}
        {paymentType === "property_tax" && (
          <div className="mb-6 bg-blue-600 text-white rounded-xl p-5 shadow-md">
            <h3 className="text-lg font-semibold mb-2">🏠 Property Tax Payment</h3>
            <p><strong>Applicant:</strong> {applicantName}</p>
            <p><strong>Property No:</strong> {propertyNo}</p>
            <p><strong>Year:</strong> {year} | <strong>Quarter:</strong> {quarter}</p>
          </div>
        )}

        {paymentType === "shop_rent" && (
          <div className="mb-6 bg-blue-600 text-white rounded-xl p-5 shadow-md">
            <h3 className="text-lg font-semibold mb-2">🏬 Shop Rent Payment</h3>
            <p><strong>Applicant:</strong> {applicantName}</p>
            <p><strong>Shop Name:</strong> {shopName}</p>
            <p><strong>Shop Number:</strong> {shopNo}</p>
          </div>
        )}

        {/* =====================
            Stripe Payment Form
        ====================== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-200">
            <PaymentElement options={{ layout: "tabs" }} />
          </div>

          <button
            disabled={isLoading || !stripe || !elements}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              `💳 Pay Rs. ${amount?.toLocaleString()}`
            )}
          </button>

          {message && (
            <div
              className={`mt-3 text-center font-medium ${
                message.includes("succeeded") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
