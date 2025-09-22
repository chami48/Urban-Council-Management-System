import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ShopRentPaymentPage() {
  const { shopId } = useParams();
  const [shopData, setShopData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/shop-payment/${shopId}`)
      .then(res => setShopData(res.data))
      .catch(err => console.error("Error fetching shop details:", err));
  }, [shopId]);

  if (!shopData) return <p>Loading...</p>;

  const handleProceedToPay = () => {
    // Pass shop details as query params to PaymentPage
    navigate(`/payment?shopName=${encodeURIComponent(shopData.shopName)}&applicantName=${encodeURIComponent(shopData.applicantName)}&nicNumber=${shopData.nicNumber}&amount=${shopData.requestedRent}`);
  };

  return (
    <div className="payment-container">
      <h2 className="header">Shop Rent Payment</h2>

      <div className="details-box">
        <p><b>Shop Name:</b> {shopData.shopName}</p>
        <p><b>Shop No:</b> {shopData.shopNo}</p>
        <p><b>Address:</b> {shopData.shopAddress}</p>
        <p><b>Lease Duration:</b> {shopData.leaseDuration}</p>
        <p><b>Monthly Rent (LKR):</b> {shopData.requestedRent}</p>
      </div>

      <div className="summary">
        <p><b>Total Amount:</b> LKR {shopData.requestedRent}</p>
      </div>

      <button className="pay-btn" onClick={handleProceedToPay}>
        Proceed to Pay
      </button>
    </div>
  );
}
