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
        //const res = await axios.get(`http://localhost:5000/inventory/${id}`);
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
    try {
      const payload = {
        ...values,
        unitPrice: Number(values.unitPrice),
        reorderLevel: Number(values.reorderLevel),
        quantity: Number(values.quantity),
      };
      //await axios.put(`http://localhost:5000/inventory/${id}`, payload);
      await axios.put(`http://localhost:5000/inventory/${id}`, payload, { withCredentials: true });
      navigate("/inventory");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update item";
      setError(msg);
    }
  };

  return (

    <>
        <Nav />  {/* Full  width nav */}
    
    <div className="inv-wrap">
      <div className="inv-header"><h2>Edit Inventory Item</h2></div>
      {error && <div className="notice error">{error}</div>}
      <InventoryForm values={values} setValues={setValues} onSubmit={onSubmit} submitLabel="Update" />
    </div>
    </>
  );
}
