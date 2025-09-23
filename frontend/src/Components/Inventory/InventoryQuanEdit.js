// src/Components/Inventory/InventoryQuanEdit.js
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav.js';
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./inventory.css";

export default function InventoryQuanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [delta, setDelta] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/inventory/${id}`, { withCredentials: true });
        setItem(res.data.item);
      } catch (e) {
        setError("Failed to load item");
      }
    };
    load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const d = Number(delta);
    if (!Number.isFinite(d)) {
      setError("Please enter a valid number (e.g., 5 or -3)");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/inventory/${id}/quantity`,
        { delta: d },
        { withCredentials: true }
      );
      navigate("/inventory");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to adjust quantity";
      setError(msg);
    }
  };

  return (
    <>
      <Nav />

      <div className="inv-wrap">
        <div className="inv-header">
          <h2>Adjust Quantity</h2>
          <Link className="btn" to="/inventory">← Back</Link>
        </div>

        {error && <div className="notice error">{error}</div>}

        {!item ? (
          <div className="empty">Loading…</div>
        ) : (
          <form className="inv-form" onSubmit={onSubmit}>
            <div className="grid">
              <label>Item Code</label>
              <div style={{ alignSelf: "center" }}>{item.itemCode}</div>

              <label>Name</label>
              <div style={{ alignSelf: "center" }}>{item.name}</div>

              <label>Current Quantity</label>
              <div style={{ alignSelf: "center" }}>{item.quantity}</div>

              <label>Change (±)</label>
              <input
                type="number"
                name="delta"
                placeholder="e.g., 5 or -3"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                required
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn primary">Apply</button>
              <button type="button" className="btn" onClick={() => navigate("/inventory")}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
