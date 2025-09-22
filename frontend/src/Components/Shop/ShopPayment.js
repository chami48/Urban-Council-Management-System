import React, { useState } from "react";
import axios from "axios";

import Nav from "../Nav/Nav";

function ShopPayment() {
  const [shopNo, setShopNo] = useState("");
  const [shopData, setShopData] = useState(null);

  

  const fetchShop = async () => {
    try {
      const res = await axios.get(`/api/shops/${shopNo}`);
      setShopData(res.data);
    } catch (err) {
      alert("Shop not found or not approved yet!");
    }
  };

  const makePayment = async () => {
    try {
      await axios.post(`/api/shops/${shopNo}/pay`, {
        amount: shopData.shop.monthlyRent + shopData.fine
      });
      alert("Payment successful!");
      setShopData(null);
      setShopNo("");
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div>
        <Nav/>
    <div className="p-5">
      <h2>Shop Rent / Trade Tax Payment</h2>
      <input
        type="text"
        placeholder="Enter Shop No"
        value={shopNo}
        onChange={(e) => setShopNo(e.target.value)}
      />
      <button onClick={fetchShop}>Check Shop</button>

      {shopData && (
        <div>
          <h3>Tenant: {shopData.shop.tenantName}</h3>
          <p>Monthly Rent: Rs. {shopData.shop.monthlyRent}</p>
          <p>Fine: Rs. {shopData.fine}</p>
          <button onClick={makePayment}>Pay Now</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default ShopPayment;
