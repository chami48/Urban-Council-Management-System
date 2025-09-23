import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav.js';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InventoryForm from "./InventoryForm";
import "./inventory.css";

export default function InventoryEdit() {
  const { id } = useParams();
  const [values, setValues] = useState({
    itemCode: "", name: "", description: "", unitsCount: "",
    unitPrice: "", reorderLevel: "", quantity: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/inventory/${id}`, { withCredentials: true });
        const i = res.data.item;
        setValues({
          itemCode: i.itemCode || "",
          name: i.name || "",
          description: i.description || "",
          unitsCount: i.unitsCount || "",
          unitPrice: i.unitPrice ?? "",
          reorderLevel: i.reorderLevel ?? "",
          quantity: i.quantity ?? "",
        });
      } catch (err) {
        setError("Failed to load item");
      }
    };
    load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- sanitize ---
    const itemCode = (values.itemCode || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");               // A–Z / 0–9 only

    const name = (values.name || "")
      .replace(/[^A-Za-z ]/g, "");              // letters + space

    const description = (values.description || "")
      .replace(/[^A-Za-z0-9,.\s]/g, "");        // letters, numbers, comma, dot, space

    const unitsCount = (values.unitsCount || "")
      .replace(/[^A-Za-z]/g, "");               // letters only

    const unitPrice    = Number(values.unitPrice);
    const reorderLevel = parseInt(values.reorderLevel, 10);
    const quantity     = parseInt(values.quantity, 10);

    // --- validate ---
    if (!itemCode || !/^[A-Z0-9]+$/.test(itemCode)) {
      setError("Item Code must contain only A–Z and 0–9.");
      return;
    }
    if (!name || !/^[A-Za-z ]+$/.test(name)) {
      setError("Name must contain letters only.");
      return;
    }
    if (!/^[A-Za-z0-9,.\s]*$/.test(description)) {
      setError("Description allows letters, numbers, comma and period only.");
      return;
    }
    if (!unitsCount || !/^[A-Za-z]+$/.test(unitsCount)) {
      setError("Units Count must contain letters only.");
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setError("Unit Price must be a number ≥ 0.");
      return;
    }
    // (optional) allow 0 for reorderLevel; keep your original rule if you want > 0
    if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
      setError("Reorder Level must be an integer ≥ 0.");
      return;
    }

    // ✅ Edit: quantity can be >= 0 (no compare to reorder)
    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be an integer ≥ 0.");
      return;
    }

    try {
      const payload = {
        itemCode,
        name,
        description,
        unitsCount,
        unitPrice,
        reorderLevel,
        quantity,
      };
      await axios.put(`http://localhost:5000/inventory/${id}`, payload, { withCredentials: true });
      navigate("/inventory");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update item";
      setError(msg);
    }
  };

  return (
    <>
      <Nav />
      <div className="inv-wrap">
        <div className="inv-header"><h2>Edit Inventory Item</h2></div>
        {error && <div className="notice error">{error}</div>}
        <InventoryForm
          values={values}
          setValues={setValues}
          onSubmit={onSubmit}
          submitLabel="Update"
          enforceAboveReorder={false}  // ⬅️ relax on Edit
        />
      </div>
    </>
  );
}
