import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

const PaymentDetailsPage = () => {
  const { propertyNo, year, quarter } = useParams(); // ✅ expect route like /payment-details/:propertyNo/:year/:quarter
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    payerName: "",
    contactNumber: "",
    email: "",
    paymentMethod: "card",
    remarks: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/payments/${propertyNo}/quarterly/${year}/${quarter}`
      )
      .then((res) => {
        setPaymentAmount(res.data.quarterlyAmount);
        setOriginalAmount(res.data.quarterlyAmount);
      })
      .catch((err) => {
        console.error("Error fetching quarterly amount:", err);
        setPaymentAmount(0);
        setOriginalAmount(0);
      });
  }, [propertyNo, year, quarter]);

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitPayment = () => {
    if (!paymentDetails.payerName || !paymentDetails.contactNumber) {
      alert("Please fill in all required fields");
      return;
    }
    if (paymentAmount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }
    alert("Are You Sure to pay?");
    navigate("/payment");
    console.log("Payment Details:", {
      amount: paymentAmount,
      ...paymentDetails,
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center">
              Payment Details
            </h1>
          </div>

          {/* Payment Amount Section */}
          <div className="p-6 border-b">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (LKR) *
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) =>
                  setPaymentAmount(parseFloat(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-semibold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="text-sm text-gray-600">
              Original Amount: LKR {originalAmount.toLocaleString()}
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payer Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={paymentDetails.payerName}
                onChange={(e) =>
                  handlePaymentDetailsChange("payerName", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                value={paymentDetails.contactNumber}
                onChange={(e) =>
                  handlePaymentDetailsChange("contactNumber", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={paymentDetails.email}
                onChange={(e) =>
                  handlePaymentDetailsChange("email", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                value={paymentDetails.paymentMethod}
                onChange={(e) =>
                  handlePaymentDetailsChange("paymentMethod", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Payment</option>
                <option value="cash">Cash Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={paymentDetails.remarks}
                onChange={(e) =>
                  handlePaymentDetailsChange("remarks", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes or remarks"
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 bg-blue-50 border-t">
            <h4 className="font-semibold text-gray-800 mb-2">
              Payment Summary
            </h4>
            <div className="flex justify-between items-center text-lg">
              <span>Total Amount:</span>
              <span className="font-bold text-blue-600">
                LKR {paymentAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 rounded-b-lg flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500"
            >
              ← BACK
            </button>
            <button
              onClick={handleSubmitPayment}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500"
            >
              PROCEED TO PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
