import React, { useState } from "react";
import Nav from '../Nav/Nav.js';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InventoryForm from "./InventoryForm";
import "./inventory.css";

export default function InventoryAdd() {
  const [values, setValues] = useState({
    itemCode: "", name: "", description: "", unitsCount: "",
    unitPrice: "", reorderLevel: "", quantity: ""
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
      //await axios.post("http://localhost:5000/inventory", payload);
      await axios.post("http://localhost:5000/inventory", payload, { withCredentials: true });
      navigate("/inventory");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add item";
      setError(msg);
    }
  };

  return (

    <>
        <Nav />  {/* Full  width nav */}



    <div className="inv-wrap">
      <div className="inv-header"><h2>Add Inventory Item</h2></div>
      {error && <div className="notice error">{error}</div>}
      <InventoryForm values={values} setValues={setValues} onSubmit={onSubmit} submitLabel="Create" />
    </div>
    {/* check */}
    </>
  );
}
