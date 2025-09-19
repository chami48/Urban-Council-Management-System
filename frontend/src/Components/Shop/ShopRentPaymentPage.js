import React, { useState, useEffect } from 'react';

const ShopRentPaymentPage = () => {
  const [shopApplication, setShopApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentAmount, setRentAmount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    payerName: '',
    contactNumber: '',
    email: '',
    paymentMethod: 'card',
    remarks: ''
  });

  // Get shop ID from URL parameters or props
  // In a real app, this would come from React Router params or props
  const shopId = 1; // This would be dynamic in a real application

  // Fetch shop application data from database
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call to fetch shop data
        // Replace this with actual API endpoint
        const response = await simulateApiCall(`/api/shop-applications/${shopId}`);
        
        if (response.success) {
          const shop = response.data;
          setShopApplication(shop);
          setRentAmount(shop.monthlyRent);
          
          // Pre-fill payment details with shop owner information
          setPaymentDetails({
            payerName: shop.ownerName,
            contactNumber: shop.contactNumber,
            email: shop.email,
            paymentMethod: 'card',
            remarks: `Monthly rent payment for ${shop.shopName}`
          });
        } else {
          setError('Failed to load shop application data');
        }
      } catch (err) {
        setError('Error connecting to database: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  // Simulate API call (replace with actual fetch/axios call)
  const simulateApiCall = async (endpoint) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate database response
    const mockData = {
      1: {
        id: 1,
        shopName: 'mnjgdsfsd',
        ownerName: 'N.k.d.chamya',
        nic: '325646',
        permanentAddress: 'Deniyaya',
        shopAddress: 'mdskhjs',
        businessCategory: 'Retail Store',
        contactNumber: '0741663031',
        email: 'xpz0124@gmail.com',
        monthlyRent: 15000,
        status: 'APPROVED',
        submittedDate: '19/09/2025'
      },
      2: {
        id: 2,
        shopName: 'scgfhyj',
        ownerName: 'Arindu semal',
        nic: '200155789635',
        permanentAddress: 'Deniyaya',
        shopAddress: 'fyht',
        businessCategory: 'Restaurant/Food Service',
        contactNumber: '0741663258',
        email: 'xpz0124@gmail.com',
        monthlyRent: 25000,
        status: 'APPROVED',
        submittedDate: '19/09/2025'
      }
    };

    const shopData = mockData[shopId];
    if (shopData) {
      return { success: true, data: shopData };
    } else {
      throw new Error('Shop application not found');
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = async () => {
    if (!paymentDetails.payerName || !paymentDetails.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (rentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      // Save payment to database
      const paymentData = {
        shopId: shopApplication.id,
        amount: rentAmount,
        payerName: paymentDetails.payerName,
        contactNumber: paymentDetails.contactNumber,
        email: paymentDetails.email,
        paymentMethod: paymentDetails.paymentMethod,
        remarks: paymentDetails.remarks,
        paymentDate: new Date().toISOString()
      };

      // Simulate API call to save payment
      const response = await simulatePaymentSubmission(paymentData);
      
      if (response.success) {
        alert(`Rent payment of LKR ${rentAmount.toLocaleString()} for ${shopApplication.shopName} submitted successfully! Payment ID: ${response.paymentId}`);
        console.log('Payment saved to database:', response);
        
        // Optionally redirect back to dashboard
        // window.history.back();
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      alert('Error processing payment: ' + err.message);
    }
  };

  // Simulate payment submission API call
  const simulatePaymentSubmission = async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful payment response
    return {
      success: true,
      paymentId: `PAY${Date.now()}`,
      message: 'Payment processed successfully',
      data: paymentData
    };
  };

  const handleBack = () => {
    window.history.back();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading shop application data...</p>
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
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">Shop Rent Payment</h1>
          <p className="text-center text-blue-100 mt-2">
            {shopApplication.shopName} - {shopApplication.shopAddress}
          </p>
          <p className="text-center text-blue-200 text-sm mt-1">
            Application ID: {shopApplication.id} | Owner: {shopApplication.ownerName}
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
            />
          </div>
          <div className="text-sm text-gray-600">
            Standard Monthly Rent: LKR {shopApplication.monthlyRent.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Business Category: {shopApplication.businessCategory}
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.nicNumber || shopApplication?.nic || ''}
                  onChange={(e) => handlePaymentDetailsChange('nicNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter NIC number"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternative Contact
                </label>
                <input
                  type="tel"
                  value={paymentDetails.altContactNumber || ''}
                  onChange={(e) => handlePaymentDetailsChange('altContactNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter alternative contact"
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
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={paymentDetails.address || shopApplication?.permanentAddress || ''}
                  onChange={(e) => handlePaymentDetailsChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter payer's address"
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
                  value={paymentDetails.referenceNumber || ''}
                  onChange={(e) => handlePaymentDetailsChange('referenceNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction/reference number"
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
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Shop Owner
              </label>
              <select
                value={paymentDetails.relationship || 'owner'}
                onChange={(e) => handlePaymentDetailsChange('relationship', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <span>Standard Rent:</span>
              <span>LKR {shopApplication.monthlyRent.toLocaleString()}</span>
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
              text: "← Back to Dashboard", 
              bg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", 
              shadow: "rgba(30, 58, 138, 0.4)", 
              onClick: handleBack 
            },
            { 
              text: "💳 Pay Rent", 
              bg: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)", 
              shadow: "rgba(234, 88, 12, 0.4)", 
              onClick: handleSubmitPayment 
            }
          ].map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              style={{
                background: button.bg,
                color: "white",
                padding: "16px 32px",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 20px ${button.shadow}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                flex: "1"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 8px 30px ${button.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 20px ${button.shadow}`;
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopRentPaymentPage;