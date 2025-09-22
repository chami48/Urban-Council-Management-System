import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from "../Nav/Nav";
import { useNavigate, useParams } from "react-router-dom";

const ShopRentPaymentPage = () => {
  const [shopApplication, setShopApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentAmount, setRentAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { shopNo } = useParams();
  
  const [paymentDetails, setPaymentDetails] = useState({
    payerName: '',
    contactNumber: '',
    email: '',
    paymentMethod: 'card',
    remarks: '',
    nicNumber: '',
    altContactNumber: '',
    address: '',
    referenceNumber: '',
    relationship: 'owner'
  });

  // Fetch shop application data from database
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!shopNo) {
          setError('Shop ID is required. Please navigate from the applications page.');
          setLoading(false);
          return;
        }

        console.log('Fetching shop data for ID:', shopNo);

        // API call to fetch shop data by ID
        const response = await axios.get(`http://localhost:5000/api/shop-applications/${shopNo}`);
        
        console.log('Shop data response:', response.data);

        if (response.data) {
          const shop = response.data;
          setShopApplication(shop);
          setRentAmount(shop.requestedRent || 15000); // Use requestedRent from your model
          
          // Pre-fill payment details with shop owner information
          setPaymentDetails({
            payerName: shop.applicantName || '',
            contactNumber: shop.phone || '',
            email: shop.email || '',
            paymentMethod: 'card',
            remarks: `Monthly rent payment for ${shop.shopName}`,
            nicNumber: shop.nicNumber || '',
            altContactNumber: shop.emergencyPhone || '',
            address: shop.permanentAddress || '',
            referenceNumber: '',
            relationship: 'owner'
          });
        } else {
          setError('Shop application not found');
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
        
        if (err.response) {
          if (err.response.status === 404) {
            setError('Shop application not found. Please check the application ID.');
          } else if (err.response.status === 500) {
            setError('Server error. Please try again later.');
          } else {
            setError(err.response.data?.message || 'Failed to load shop data');
          }
        } else if (err.request) {
          setError('Cannot connect to server. Please check your internet connection.');
        } else {
          setError('An unexpected error occurred: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopNo]);

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = async () => {
    // Validation
    if (!paymentDetails.payerName || !paymentDetails.contactNumber) {
      alert('Please fill in all required fields (Name and Contact Number)');
      return;
    }

    if (rentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (!shopApplication || !shopApplication._id) {
      alert('Shop application data is missing. Please refresh the page.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare payment data for database
      const paymentData = {
        shopNo: shopApplication._id,
        shopApplicationId: shopApplication._id,
        shopName: shopApplication.shopName,
        shopOwner: shopApplication.applicantName,
        shopNo: shopApplication.shopNo,
        amount: rentAmount,
        payerName: paymentDetails.payerName,
        contactNumber: paymentDetails.contactNumber,
        email: paymentDetails.email,
        paymentMethod: paymentDetails.paymentMethod,
        remarks: paymentDetails.remarks,
        nicNumber: paymentDetails.nicNumber,
        altContactNumber: paymentDetails.altContactNumber,
        address: paymentDetails.address,
        referenceNumber: paymentDetails.referenceNumber,
        relationship: paymentDetails.relationship,
        paymentDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Submitting payment data:', paymentData);

      // API call to save payment to database
      const response = await axios.post('http://localhost:5000/api/payments', paymentData);
      
      console.log('Payment response:', response.data);

      if (response.data) {
        const paymentId = response.data._id || response.data.id || 'N/A';
        alert(`✅ Rent payment of LKR ${rentAmount.toLocaleString()} for ${shopApplication.shopName} submitted successfully!\n\nPayment ID: ${paymentId}\n\nYou will be redirected to your applications.`);
        
        navigate('/my-applications');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      
      if (err.response) {
        if (err.response.status === 400) {
          alert('❌ Invalid payment data. Please check all fields and try again.');
        } else if (err.response.status === 500) {
          alert('❌ Server error while processing payment. Please try again later.');
        } else {
          alert(`❌ Payment failed: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        alert('❌ Cannot connect to payment server. Please check your internet connection.');
      } else {
        alert('❌ Payment submission failed: ' + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/my-applications');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading shop application data...</p>
          <p className="text-gray-500 text-sm mt-2">Shop ID: {shopNo}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/my-applications')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!shopApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No shop application data found.</p>
          <button
            onClick={() => navigate('/my-applications')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav/>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center">Shop Rent Payment</h1>
            <p className="text-center text-blue-100 mt-2">
              {shopApplication.shopName} - {shopApplication.shopAddress}
            </p>
            <p className="text-center text-blue-200 text-sm mt-1">
              Application ID: {shopApplication._id} | Owner: {shopApplication.applicantName}
            </p>
          </div>

          {/* Payment Amount Section */}
          <div className="p-6 border-b">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent Amount (LKR) *
              </label>
              <input
                type="number"
                value={rentAmount}
                onChange={(e) => setRentAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-semibold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                min="0"
                required
                disabled={submitting}
              />
            </div>
            <div className="text-sm text-gray-600">
              Requested Monthly Rent: LKR {(shopApplication.requestedRent || 15000).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Business Category: {shopApplication.businessCategory}
            </div>
            {shopApplication.shopNo && (
              <div className="text-xs text-gray-500 mt-1">
                Shop Number: {shopApplication.shopNo}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Shop Area: {shopApplication.shopArea} sq ft
            </div>
          </div>

          {/* Payer Information Section */}
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                👤 Payer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.payerName}
                    onChange={(e) => handlePaymentDetailsChange('payerName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter payer's full name"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.nicNumber}
                    onChange={(e) => handlePaymentDetailsChange('nicNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter NIC number"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={paymentDetails.contactNumber}
                    onChange={(e) => handlePaymentDetailsChange('contactNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternative Contact
                  </label>
                  <input
                    type="tel"
                    value={paymentDetails.altContactNumber}
                    onChange={(e) => handlePaymentDetailsChange('altContactNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter alternative contact"
                    disabled={submitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={paymentDetails.email}
                    onChange={(e) => handlePaymentDetailsChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    disabled={submitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.address}
                    onChange={(e) => handlePaymentDetailsChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter payer's address"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                💳 Payment Method
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentDetails.paymentMethod}
                    onChange={(e) => handlePaymentDetailsChange('paymentMethod', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={submitting}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile">Mobile Payment (eZ Cash/mCash)</option>
                    <option value="cash">Cash Payment</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.referenceNumber}
                    onChange={(e) => handlePaymentDetailsChange('referenceNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter transaction/reference number"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                📝 Additional Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={paymentDetails.remarks}
                  onChange={(e) => handlePaymentDetailsChange('remarks', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes or special instructions"
                  disabled={submitting}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship to Shop Owner
                </label>
                <select
                  value={paymentDetails.relationship}
                  onChange={(e) => handlePaymentDetailsChange('relationship', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                >
                  <option value="owner">Shop Owner</option>
                  <option value="authorized_agent">Authorized Agent</option>
                  <option value="family_member">Family Member</option>
                  <option value="business_partner">Business Partner</option>
                  <option value="employee">Employee</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 bg-blue-50 border-t">
            <h4 className="font-semibold text-gray-800 mb-2">Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Shop:</span>
                <span className="font-medium">{shopApplication.shopName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Requested Rent:</span>
                <span>LKR {(shopApplication.requestedRent || 15000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-lg border-t pt-2">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-blue-600">LKR {rentAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 rounded-b-lg flex gap-4">
            {[
              { 
                text: "← Back to Applications", 
                bg: submitting ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)" : "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", 
                shadow: submitting ? "rgba(107, 114, 128, 0.4)" : "rgba(30, 58, 138, 0.4)", 
                onClick: handleBack,
                disabled: submitting
              },
              { 
                text: submitting ? "Processing Payment..." : "💳 Pay Rent", 
                bg: submitting ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)" : "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)", 
                shadow: submitting ? "rgba(107, 114, 128, 0.4)" : "rgba(234, 88, 12, 0.4)", 
                onClick: handleSubmitPayment,
                disabled: submitting
              }
            ].map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                disabled={button.disabled}
                style={{
                  background: button.bg,
                  color: "white",
                  padding: "16px 32px",
                  border: "none",
                  borderRadius: "16px",
                  cursor: button.disabled ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  boxShadow: `0 4px 20px ${button.shadow}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  flex: "1",
                  opacity: button.disabled ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!button.disabled) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = `0 8px 30px ${button.shadow}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!button.disabled) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = `0 4px 20px ${button.shadow}`;
                  }
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRentPaymentPage;