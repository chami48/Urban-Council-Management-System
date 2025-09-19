import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OfficerApprovalQueue() {
  const [items, setItems] = useState([]);

  async function load() {
    const res = await axios.get("http://localhost:5000/business/officer/pending");
    setItems(res.data);
  }
  useEffect(() => { load(); }, []);

  async function approve(id) {
    const res = await axios.patch(`http://localhost:5000/license/approve/${id}`);
    alert(res.data.message);
    await load();
  }

  return (
    <div>
      <h3>Officer Queue</h3>
      <ul>
        {items.map(b => (
          <li key={b._id}>
            {b.businessName} ({b.ownerNIC}) 
            <button onClick={() => approve(b._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
