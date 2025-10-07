// src/Components/Inventory/InventoryQuanEdit.js
import React, { useEffect, useState } from "react";
import Nav from "../Navigation/Navigation";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./inventory.css";
import Swal from "sweetalert2";
// (optional) prettier default theme
// import "sweetalert2/dist/sweetalert2.min.css";

export default function InventoryQuanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [delta, setDelta] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/inventory/${id}`, {
          withCredentials: true,
        });
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
    const { data } = await axios.patch(
        `http://localhost:5000/inventory/${id}/quantity`,
        { delta: d },
        { withCredentials: true }
      );
      await Swal.fire({
      icon: "success",
      title: "Quantity adjusted",
      text: `Δ ${d > 0 ? "+" : ""}${d} • New Qty: ${data?.item?.quantity ?? "updated"}`,
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/inventory");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to adjust quantity";
      setError(msg);
      Swal.fire({ icon: "error", title: "Adjustment failed", text: msg });
   
    }
  };

  return (
    <>
      <Nav />

      {/* Use the same wrapper used by other inventory pages */}
      <main className="inventory-page-with-nav">
        <div className="inv-wrap">
          <div className="inv-header">
            <h2>Adjust Quantity</h2>

            {/* Back matches your gradient “Create” style */}
            <Link className="btn back pill" to="/inventory">
              ← Back to Inventory
            </Link>
          </div>

          {error && <div className="notice error">{error}</div>}

          {!item ? (
            <div className="empty">Loading…</div>
          ) : (
            <form className="inv-form" onSubmit={onSubmit}>
              {/* compact, aligned grid like your other forms */}
              <div className="grid" style={{ rowGap: 10, columnGap: 14 }}>
                <label>Item Code</label>
                <div style={{ alignSelf: "center", fontWeight: 600 }}>
                  {item.itemCode}
                </div>

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

              {/* actions aligned and themed */}
              <div
                className="actions"
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 14,
                }}
              >
                <button type="button" className="btn subtle" onClick={() => navigate("/inventory")}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Apply
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
