import React, { useState } from "react";
import axios from "axios";

export default function MyLicenses() {
  const [nic, setNic] = useState("");
  const [items, setItems] = useState([]);

  async function load() {
    if (!nic) return;
    const res = await axios.get(`http://localhost:5000/license/mine?ownerNIC=${nic}`);
    setItems(res.data);
  }

  async function issue(licenseId) {
    await axios.post(`http://localhost:5000/license/issue/${licenseId}`);
    await load();
  }

  return (
    <div>
      <h3>My Licenses</h3>
      <input value={nic} onChange={e => setNic(e.target.value)} placeholder="Enter NIC" />
      <button onClick={load}>Load</button>
      <ul>
        {items.map(l => (
          <li key={l._id}>
            {l.business.businessName} - {l.status}
            {l.status === "PENDING_PAYMENT" && <button onClick={() => issue(l._id)}>Mark Paid & Issue</button>}
            {l.certificateUrl && <a href={`http://localhost:5000/${l.certificateUrl}`} target="_blank" rel="noreferrer">Download</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
