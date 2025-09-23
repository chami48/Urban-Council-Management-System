import React, { useEffect, useState } from "react";
import Nav from "../Navigation/Navigation";
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
      const res = await axios.get(
        `http://localhost:5000/inventory-logs?page=${page}&limit=100`,
        { withCredentials: true }
      );
      setLogs(res.data.logs || []);
      setMeta({
        total: res.data.total || 0,
        page: res.data.page || 1,
        pages: res.data.pages || 1,
      });
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <>
      <Nav />

      {/* Use the same layout wrapper as other inventory pages */}
      <main className="inventory-page-with-nav">
        <div className="inv-wrap">
          <div className="inv-header">
            <h2>Inventory Log</h2>

            {/* Use themed Back button (matches Create) */}
            <Link className="btn back pill" to="/inventory">
              ← Back to Inventory
            </Link>
          </div>

          <div className="inv-meta" style={{ marginBottom: 8 }}>
            {loading
              ? "Loading…"
              : `Showing ${logs.length} of ${meta.total} log entries`}{" "}
            · Page {meta.page} / {meta.pages}
          </div>

          {/* Scroll wrapper + dedicated log grid so columns align perfectly */}
          <div className="table-scroll">
            <div className="table log">
              <div className="thead log">
                <div>Date/Time</div>
                <div>Action</div>
                <div>Item Code</div>
                <div>Name</div>
                <div>Qty</div>
                <div>Δ Qty</div>
                <div>User</div>
              </div>

              {logs.map((l) => (
                <div className="trow log" key={l._id}>
                  <div>{new Date(l.changedAt || l.createdAt).toLocaleString()}</div>
                  <div>{l.action}</div>
                  <div>{l.itemCode}</div>
                  <div>{l.name}</div>
                  <div className="num">{l.quantity}</div>
                  <div className="num">{l.deltaQuantity ?? ""}</div>
                  <div>
                    {l.changedBy?.name}
                    {l.changedBy?.role ? ` (${l.changedBy.role})` : ""}
                  </div>
                </div>
              ))}

              {logs.length === 0 && !loading && (
                <div className="empty">No log entries.</div>
              )}
            </div>
          </div>

          {meta.pages > 1 && (
            <div className="pager">
              <button
                className="btn subtle pill"
                disabled={meta.page <= 1}
                onClick={() => load(meta.page - 1)}
              >
                Prev
              </button>
              <button
                className="btn subtle pill"
                disabled={meta.page >= meta.pages}
                onClick={() => load(meta.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
