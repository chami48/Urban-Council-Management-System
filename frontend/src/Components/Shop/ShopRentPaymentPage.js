// src/Components/Shop/ShopRentPaymentPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from '../Nav/Nav';

export default function ShopRentPaymentPage() {
  const { shopId } = useParams();
  const [shopData, setShopData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/shop-payment/${shopId}`)
      .then((res) => setShopData(res.data))
      .catch((err) => console.error("Error fetching shop details:", err));
  }, [shopId]);

  const handleProceedToPay = () => {
    navigate(`/payment?paymentType=shop_rent&shopId=${shopId}`);
  };

  if (!shopData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-10">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-white drop-shadow-md mb-2">
            🏪 Shop Rent Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review your shop details and proceed with payment.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
          {/* Gradient top bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400"></div>

          <div className="p-8 space-y-6">
            {/* Shop Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shop Name</p>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{shopData.shopName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shop No</p>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{shopData.shopNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{shopData.shopAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lease Duration</p>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{shopData.leaseDuration}</p>
              </div>
            </div>

            {/* Rent Section */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-xl font-bold">💰 Monthly Rent</p>
              <p className="text-3xl font-extrabold mt-2">LKR {shopData.requestedRent}</p>
            </div>

            {/* Total + Pay Button */}
            <div className="flex flex-col items-center gap-4 mt-6">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Total Amount: <span className="text-indigo-600 dark:text-indigo-400">LKR {shopData.requestedRent}</span>
              </p>
              <button
                onClick={handleProceedToPay}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                🚀 Proceed to Pay
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
