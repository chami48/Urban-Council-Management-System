// src/Components/Inventory/InventoryList.js
import React, { useEffect, useMemo, useState } from "react";
import Nav from "../Navigation/Navigation";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";


// PDF deps
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Page-scoped styles (only for inventory)
import "./inventory.css";

/* =============================
   GOV-style header/footer config (images in /public)
   ============================= */
const GOV = {
  emblemPath: "/emblem.png",
  logoPath: "/horanalogo.png",
  signaturePath: "/signature.png",
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa",
  address: "123, Anguruwathota Horana",
  email: "horanaurbancouncil123@gmail.com",
  fax: "1235565",
};

// Load PNG from /public into base64 for jsPDF
const loadPngAsBase64 = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = src;
  });

// ======== PDF BUILDER (kept in original maroon theme) ========
async function buildInventoryPdf({ rows, columns, title, subtitle }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const now = new Date();

  const addGovernmentHeader = async () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 150, "F");

    // MAROON
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageW - margin, 145);

    try {
      const emblem = await loadPngAsBase64(GOV.emblemPath);
      doc.addImage(emblem, "PNG", margin, 40, 50, 50);
    } catch {}
    try {
      const logo = await loadPngAsBase64(GOV.logoPath);
      doc.addImage(logo, "PNG", pageW - margin - 50, 40, 50, 50);
    } catch {}

    const cx = pageW / 2;
    // MAROON headings
    doc.setTextColor(128, 0, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(GOV.country, cx, 35, { align: "center" });
    doc.setFontSize(16);
    doc.text(GOV.council, cx, 57, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(GOV.localName, cx, 77, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${GOV.address} | Email: ${GOV.email} | Fax: ${GOV.fax}`, cx, 98, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), cx, 120, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, cx, 135, { align: "center" });
  };

  const addSimpleHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 150, "F");

    // MAROON
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageW - margin, 145);

    // placeholders
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(2);
    doc.rect(margin, 40, 50, 50, "S");
    doc.rect(pageW - margin - 50, 40, 50, 50, "S");

    const cx = pageW / 2;
    // MAROON headings
    doc.setTextColor(128, 0, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(GOV.country, cx, 35, { align: "center" });
    doc.setFontSize(16);
    doc.text(GOV.council, cx, 57, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(GOV.localName, cx, 77, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), cx, 120, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, cx, 135, { align: "center" });
  };

  const addFooter = async () => {
    const footerY = pageH - 110;

    // Left: generated date/time
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Generated on:", margin, footerY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      now.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      margin,
      footerY + 15
    );
    doc.text(
      now.toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      margin,
      footerY + 30
    );

    // Right: signature
    const sigX = pageW - margin - 160;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Authorized by:", sigX, footerY);

    let ok = false;
    try {
      const sig = await loadPngAsBase64(GOV.signaturePath);
      if (sig) {
        doc.addImage(sig, "PNG", sigX, footerY + 10, 100, 25);
        ok = true;
      }
    } catch {}

    if (!ok) {
      // fallback line + squiggle (kept neutral/dark)
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2);
      doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(2.5);
      const y = footerY + 20;
      doc.line(sigX + 15, y, sigX + 35, y - 6);
      doc.line(sigX + 35, y - 6, sigX + 55, y + 4);
      doc.line(sigX + 55, y + 4, sigX + 85, y - 3);
      doc.line(sigX + 85, y - 3, sigX + 115, y + 6);
      doc.line(sigX + 115, y + 6, sigX + 135, y - 2);
    }

    // Officer lines
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("Inventory Officer", sigX, footerY + 40);
    doc.text("Horana Urban Council", sigX, footerY + 52);

    // bottom border + centered page number (MAROON)
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(1);
    doc.line(margin, footerY + 70, pageW - margin, footerY + 70);

    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(pageStr, pageW / 2, footerY + 85, { align: "center" });
  };

  await addGovernmentHeader();

  autoTable(doc, {
    startY: 165,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) =>
      columns.map((c) => (typeof c.accessor === "function" ? c.accessor(r) : r[c.accessor] ?? ""))
    ),
    headStyles: {
      fillColor: [128, 0, 32], // MAROON
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      fontSize: 11,
    },
    bodyStyles: { fontSize: 10, cellPadding: 10, lineColor: [180, 180, 180], lineWidth: 0.5, valign: "middle" },
    alternateRowStyles: { fillColor: [248, 250, 255] },
    styles: { fontSize: 10, cellPadding: 8, halign: "center", overflow: "linebreak" },
    margin: { top: 170, bottom: 120, left: margin, right: margin },
    didDrawPage: async (data) => {
      if (data.pageNumber > 1) addSimpleHeader();
      await addFooter();
    },
  });

  if (doc.internal.getNumberOfPages() === 1) {
    await addFooter();
  }

  return doc;
}

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
      .filter(([_, v]) => v !== undefined && v !== null && String(v).trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

  // Load data (inventory + low stock)
  const load = async () => {
    setLoading(true);
    try {
      const qs = toQueryString(queryObj);
      const [allRes, lowRes] = await Promise.all([
        axios.get(`http://localhost:5000/inventory?${qs}`, { withCredentials: true }),
        axios.get("http://localhost:5000/inventory/low", { withCredentials: true }),
      ]);

      const all = allRes?.data?.items ?? [];
      const low = lowRes?.data?.items ?? [];

      setItems(all);
      setLowItems(low);

      if (low.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Low stock alert",
          text: `${low.length} item(s) need reordering`,
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }


      setMeta({
        total: allRes?.data?.total ?? all.length,
        page: allRes?.data?.page ?? 1,
        pages: allRes?.data?.pages ?? 1,
      });

      setSearchParams(queryObj);

      // if ("Notification" in window) {
      //   if (Notification.permission === "default") {
      //     try {
      //       await Notification.requestPermission();
      //     } catch {}
      //   }
      //   if (Notification.permission === "granted" && low.length > 0) {
      //     new Notification("Low stock alert", { body: `${low.length} item(s) need reordering` });
      //   }
      // }


      



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
   const confirm = await Swal.fire({
     icon: "warning",
     title: "Delete this item?",
     text: "This action cannot be undone.",
     showCancelButton: true,
     confirmButtonText: "Yes, delete",
     cancelButtonText: "Cancel",
   });
   if (!confirm.isConfirmed) return;

   try {
     await axios.delete(`http://localhost:5000/inventory/${id}`, { withCredentials: true });
     await Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
     load();
   } catch (err) {
     const msg = err?.response?.data?.message || "Failed to delete item";
     Swal.fire({ icon: "error", title: "Delete failed", text: msg });
   }
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

  // ====== PDF Export helpers ======
  const columns = [
    { header: "Code", accessor: "itemCode" },
    { header: "Name", accessor: "name" },
    { header: "Units", accessor: "unitsCount" },
    { header: "Unit Price", accessor: (r) => r.unitPrice ?? "" },
    { header: "Reorder", accessor: "reorderLevel" },
    { header: "Qty", accessor: "quantity" },
    {
      header: "Created",
      accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""),
    },
  ];

  const downloadInventoryPdfPage = async () => {
    const now = new Date();
    const doc = await buildInventoryPdf({
      rows: items,
      columns,
      title: "Inventory Report",
      subtitle: `Filters applied • Records: ${items.length} • ${now.toLocaleString()}`,
    });
    doc.save(`Inventory_Report_${now.toISOString().slice(0, 10)}.pdf`);
  };

  // export ALL rows that match current filters (bypasses pagination)
  const downloadInventoryPdfAll = async () => {
    const now = new Date();
    try {
      const qs = toQueryString({ ...queryObj, page: 1, limit: 1000000 });
      const res = await axios.get(`http://localhost:5000/inventory?${qs}`, { withCredentials: true });
      const allRows = res?.data?.items ?? [];
      const doc = await buildInventoryPdf({
        rows: allRows,
        columns,
        title: "Inventory Report (All)",
        subtitle: `All filtered rows • Records: ${allRows.length} • ${now.toLocaleString()}`,
      });
      doc.save(`Inventory_Report_All_${now.toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error("Export ALL error:", e);
      await downloadInventoryPdfPage();
    }
  };

  return (
    <>
      <Nav />

      {/* Wrapper that respects fixed sidebar/header without touching Navigation */}
      <main className="inventory-page-with-nav">
        <div className="inv-wrap">
          <div className="inv-header">
            <h2>Inventory</h2>
            <div className="header-actions">
              {/*<button className="btn" onClick={downloadInventoryPdfPage}>Export PDF (Page)</button>*/}
              <button className="btn" onClick={downloadInventoryPdfAll}>Export PDF </button>
              <button className="btn" onClick={() => navigate("/inventory/logs")}>Inventory Log</button>
              <button className="btn primary" onClick={() => navigate("/inventory/add")}>+ Add Item</button>
            </div>
          </div>

          {/* 🔎 Global search + minimal controls */}
          <div className="inv-filters">
            <div className="inv-filters-row">
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
              <button className="btn subtle" onClick={resetFilters}>Reset</button>
            </div>

            <div className="inv-meta">
              {loading ? "Loading…" : `Showing ${items.length} of ${meta.total} item(s)`} · Page {meta.page} / {meta.pages}
            </div>
          </div>

          {/* 🔔 Low stock banner */}
          {lowItems.length > 0 && (
            <div className="notice warn" style={{ marginBottom: 12 }}>
              {lowItems.length} item{lowItems.length > 1 ? "s" : ""} at/below reorder level:&nbsp;
              {lowItems.slice(0, 5).map((i) => i.itemCode).join(", ")}
              {lowItems.length > 5 ? "…" : ""}
            </div>
          )}

          {/* Table (wrapped for horizontal scroll safety) */}
          <div className="table-scroll">
            <div className="table">
              <div className="thead">
                <div>Code</div>
                <div>Name</div>
                <div>Units</div>
                <div>Unit Price</div>
                <div>Reorder</div>
                <div>Qty</div>
                <div>Actions</div>
              </div>

              {items.map((i) => (
                <div className={`trow ${i.quantity <= i.reorderLevel ? "low" : ""}`} key={i._id}>
                  <div>{i.itemCode}</div>
                  <div>{i.name}</div>
                  <div className="num">{i.unitsCount}</div>
                  <div className="num">{i.unitPrice}</div>
                  <div className="num">{i.reorderLevel}</div>
                  <div className="num">{i.quantity}</div>
                  <div className="actions">
                    <Link className="btn pill" to={`/inventory/${i._id}/qty`}>Adjust&nbsp;Qty</Link>
                    <Link className="btn pill" to={`/inventory/${i._id}`}>Edit</Link>
                    <button className="btn danger pill" onClick={() => remove(i._id)}>Delete</button>
                  </div>
                </div>
              ))}

              {items.length === 0 && !loading && <div className="empty">No items found.</div>}
            </div>
          </div>

          {/* Simple pager */}
          {meta.pages > 1 && (
            <div className="pager">
              <button className="btn subtle" disabled={meta.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <button className="btn subtle" disabled={meta.page >= meta.pages} onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}>Next</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
