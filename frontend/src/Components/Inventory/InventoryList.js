// src/Components/Inventory/InventoryList.js
import React, { useEffect, useMemo, useState } from "react";
import Nav from '../Nav/Nav.js';
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [lowItems, setLowItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Local UI state bound to inputs
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [itemCode, setItemCode] = useState(searchParams.get("itemCode") || "");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [unitsCount, setUnitsCount] = useState(searchParams.get("unitsCount") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minReorder, setMinReorder] = useState(searchParams.get("minReorder") || "");
  const [maxReorder, setMaxReorder] = useState(searchParams.get("maxReorder") || "");
  const [minQty, setMinQty] = useState(searchParams.get("minQty") || "");
  const [maxQty, setMaxQty] = useState(searchParams.get("maxQty") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt:desc");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const limit = 100; // same default as backend

  // Build query object from current filters (ignore empty)
  const queryObj = useMemo(() => {
    const qObj = { page, limit, sort };
    if (q) qObj.q = q;
    if (itemCode) qObj.itemCode = itemCode;
    if (name) qObj.name = name;
    if (unitsCount) qObj.unitsCount = unitsCount;
    if (minPrice) qObj.minPrice = minPrice;
    if (maxPrice) qObj.maxPrice = maxPrice;
    if (minReorder) qObj.minReorder = minReorder;
    if (maxReorder) qObj.maxReorder = maxReorder;
    if (minQty) qObj.minQty = minQty;
    if (maxQty) qObj.maxQty = maxQty;
    return qObj;
  }, [q, itemCode, name, unitsCount, minPrice, maxPrice, minReorder, maxReorder, minQty, maxQty, sort, page]);

  const toQueryString = (obj) =>
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

  // Load data (inventory + low stock)
  const load = async () => {
    setLoading(true);
    try {
      const qs = toQueryString(queryObj);
      const [allRes, lowRes] = await Promise.all([
        //axios.get(`http://localhost:5000/inventory?${qs}`),
        axios.get(`http://localhost:5000/inventory?${qs}`, { withCredentials: true }),

        //axios.get("http://localhost:5000/inventory/low"),
        axios.get("http://localhost:5000/inventory/low", { withCredentials: true })

      ]);

      const all = allRes?.data?.items ?? [];
      const low = lowRes?.data?.items ?? [];

      setItems(all);
      setLowItems(low);
      setMeta({
        total: allRes?.data?.total ?? all.length,
        page: allRes?.data?.page ?? 1,
        pages: allRes?.data?.pages ?? 1,
      });

      // push filters to URL so refresh/back works
      setSearchParams(queryObj);

      // optional desktop notification
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          try { await Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === "granted" && low.length > 0) {
          new Notification("Low stock alert", { body: `${low.length} item(s) need reordering` });
        }
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryObj]); // reload whenever filters change

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    //await axios.delete(`http://localhost:5000/inventory/${id}`);
    await axios.delete(`http://localhost:5000/inventory/${id}`, { withCredentials: true })

    load();
  };

  const resetFilters = () => {
    setQ("");
    setItemCode("");
    setName("");
    setUnitsCount("");
    setMinPrice("");
    setMaxPrice("");
    setMinReorder("");
    setMaxReorder("");
    setMinQty("");
    setMaxQty("");
    setSort("createdAt:desc");
    setPage(1);
  };

  return (
    <>
      <Nav />

      <div className="inv-wrap">
        <div className="inv-header">
          <h2>Inventory</h2>
          <button className="btn primary" onClick={() => navigate("/inventory/add")}>+ Add Item</button>
        </div>

        {/* 🔎 Global search + minimal controls */}
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Search all columns (code, name, units, description, numbers)…"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="createdAt:desc">Newest</option>
              <option value="itemCode:asc">Code ↑</option>
              <option value="itemCode:desc">Code ↓</option>
              <option value="name:asc">Name ↑</option>
              <option value="name:desc">Name ↓</option>
              <option value="unitPrice:asc">Price ↑</option>
              <option value="unitPrice:desc">Price ↓</option>
              <option value="quantity:asc">Qty ↑</option>
              <option value="quantity:desc">Qty ↓</option>
            </select>
            <button className="btn" onClick={resetFilters}>Reset</button>
          </div>

          {/* Advanced per-field filters (all optional)
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            <input placeholder="Code" value={itemCode} onChange={(e) => { setItemCode(e.target.value); setPage(1); }} />
            <input placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); setPage(1); }} />
            <input placeholder="Units (pcs, boxes…)" value={unitsCount} onChange={(e) => { setUnitsCount(e.target.value); setPage(1); }} />
            <input placeholder="Min Price" type="number" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
            <input placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
            <div />
            <input placeholder="Min Reorder" type="number" value={minReorder} onChange={(e) => { setMinReorder(e.target.value); setPage(1); }} />
            <input placeholder="Max Reorder" type="number" value={maxReorder} onChange={(e) => { setMaxReorder(e.target.value); setPage(1); }} />
            <input placeholder="Min Qty" type="number" value={minQty} onChange={(e) => { setMinQty(e.target.value); setPage(1); }} />
            <input placeholder="Max Qty" type="number" value={maxQty} onChange={(e) => { setMaxQty(e.target.value); setPage(1); }} />
          </div>
             */}
          <div style={{ fontSize: 13, color: "#555" }}>
            {loading ? "Loading…" : `Showing ${items.length} of ${meta.total} item(s)`} · Page {meta.page} / {meta.pages}
          </div>
        </div>

        {/* 🔔 Low stock banner */}
        {lowItems.length > 0 && (
          <div className="notice warn" style={{ marginBottom: 12 }}>
            {lowItems.length} item{lowItems.length > 1 ? "s" : ""} at/below reorder level:&nbsp;
            {lowItems.slice(0, 5).map(i => i.itemCode).join(", ")}
            {lowItems.length > 5 ? "…" : ""}
          </div>
        )}

        {/* Table */}
        <div className="table">
          <div className="thead">
            <div>Code</div><div>Name</div><div>Units</div>
            <div>Unit Price</div><div>Reorder</div><div>Qty</div><div>Actions</div>
          </div>

          {items.map(i => (
            <div className={`trow ${i.quantity <= i.reorderLevel ? "low" : ""}`} key={i._id}>
              <div>{i.itemCode}</div>
              <div>{i.name}</div>
              <div>{i.unitsCount}</div>
              <div>{i.unitPrice}</div>
              <div>{i.reorderLevel}</div>
              <div>{i.quantity}</div>
              <div className="actions">
                <Link className="btn" to={`/inventory/${i._id}/qty`}>Adjust&nbsp;Qty</Link>              
                <Link className="btn" to={`/inventory/${i._id}`}>Edit</Link>
                <button className="btn danger" onClick={() => remove(i._id)}>Delete</button>
              </div>
            </div>
          ))}

          {items.length === 0 && !loading && <div className="empty">No items found.</div>}
        </div>

        {/* Simple pager (only shows when multiple pages) */}
        {meta.pages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
            <button
              className="btn"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="btn"
              disabled={meta.page >= meta.pages}
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
