// src/Components/Inventory/InventoryAdd.js

import React, { useState } from "react";
import Nav from "../Navigation/Navigation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InventoryForm from "./InventoryForm";
import "./inventory.css";

import Swal from "sweetalert2";
// (optional) prettier default theme
// import "sweetalert2/dist/sweetalert2.min.css";


export default function InventoryAdd() {
  const [values, setValues] = useState({
    itemCode: "",
    name: "",
    description: "",
    unitsCount: "",
    unitPrice: "",
    reorderLevel: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...values,
        unitPrice: Number(values.unitPrice),
        reorderLevel: Number(values.reorderLevel),
        quantity: Number(values.quantity),
      };
      

      const { data } = await axios.post("http://localhost:5000/inventory", payload, { withCredentials: true });
      await Swal.fire({
        icon: "success",
        title: "Item created",
        text: `${data?.item?.itemCode || payload.itemCode} — ${data?.item?.name || payload.name}`,
        timer: 1600,
        showConfirmButton: false,
      });
      navigate("/inventory");


    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add item";
      setError(msg);
      Swal.fire({ icon: "error", title: "Create failed", text: msg });
    }
  };

  return (
    <>
      {/* Keep your Navigation as-is */}
      <Nav />

      {/* Wrapper that respects fixed sidebar (w-72) and sticky top header */}
      <main className="inventory-page-with-nav">
        <div className="inv-wrap">
          <div className="inv-header">
            <h2>Add Inventory Item</h2>

            {/* Optional quick actions to match list page aesthetics */}
            <div className="header-actions">
              <button className="btn back pill" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>

          {error && <div className="notice error">{error}</div>}

          {/* Reuse your shared form component so styling stays consistent */}
          <div className="inv-form">
            <InventoryForm
              values={values}
              setValues={setValues}
              onSubmit={onSubmit}
              submitLabel="Create"
              enforceAboveReorder={true} // keep strict on Add
            />
          </div>
        </div>
      </main>
    </>
  );
}
