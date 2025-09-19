import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PHIInspectionQueue() {
  const [items, setItems] = useState([]);

  async function load() {
    const res = await axios.get("http://localhost:5000/business/phi/pending");
    setItems(res.data);
  }
  useEffect(() => { load(); }, []);

  async function mark(id, result) {
    await axios.patch(`http://localhost:5000/business/${id}/inspection`, { result });
    await load();
  }

  return (
    <div>
      <h3>PHI Pending</h3>
      <ul>
        {items.map(b => (
          <li key={b._id}>
            {b.businessName} ({b.ownerNIC}) 
            <button onClick={() => mark(b._id, "PASS")}>Pass</button>
            <button onClick={() => mark(b._id, "FAIL")}>Fail</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
