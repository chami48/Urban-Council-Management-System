import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import "./inventory.css";

export default function InventoryLog() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/inventory-logs?page=${page}&limit=100`, { withCredentials: true });
      setLogs(res.data.logs || []);
      setMeta({ total: res.data.total || 0, page: res.data.page || 1, pages: res.data.pages || 1 });
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  return (
    <>
      <Nav />
      <div className="inv-wrap">
        <div className="inv-header">
          <h2>Inventory Log</h2>
          <Link className="btn" to="/inventory">← Back to Inventory</Link>
        </div>

        <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
          {loading ? "Loading…" : `Showing ${logs.length} of ${meta.total} log entries`} · Page {meta.page} / {meta.pages}
        </div>

        <div className="table">
          <div className="thead">
            <div>Date/Time</div>
            <div>Action</div>
            <div>Item Code</div>
            <div>Name</div>
            <div>Qty</div>
            <div>Δ Qty</div>
            <div>User</div>
          </div>

          {logs.map(l => (
            <div className="trow" key={l._id}>
              <div>{new Date(l.changedAt || l.createdAt).toLocaleString()}</div>
              <div>{l.action}</div>
              <div>{l.itemCode}</div>
              <div>{l.name}</div>
              <div>{l.quantity}</div>
              <div>{l.deltaQuantity ?? ""}</div>
              <div>{l.changedBy?.name} ({l.changedBy?.role})</div>
            </div>
          ))}

          {logs.length === 0 && !loading && <div className="empty">No log entries.</div>}
        </div>

        {meta.pages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
            <button className="btn" disabled={meta.page <= 1} onClick={() => load(meta.page - 1)}>Prev</button>
            <button className="btn" disabled={meta.page >= meta.pages} onClick={() => load(meta.page + 1)}>Next</button>
          </div>
        )}
      </div>
    </>
  );
}
