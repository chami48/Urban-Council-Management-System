import React, { useMemo, useState } from "react";

export default function InventoryForm({
  values,
  setValues,
  onSubmit,
  submitLabel = "Save",
  enforceAboveReorder = false,
}) {
  const [localError, setLocalError] = useState("");

  // const totalStock = useMemo(() => {
  //   const q = Number(values.quantity || 0);
  //   return Number.isFinite(q) ? q : 0;
  // }, [values.quantity]);

   const totalStockPrice = useMemo(() => {
    const qty = Number(values.quantity);
    const price = Number(values.unitPrice);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) return 0;
    // round to 2 decimals
    return Math.round((qty * price + Number.EPSILON) * 100) / 100;
  }, [values.quantity, values.unitPrice]);





  const handleChange = (field) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [field]: v }));
  };

  const handleNumberChange = (field) => (e) => {
    const raw = e.target.value;
    // Allow empty input for UX; convert to number on submit
    setValues((prev) => ({ ...prev, [field]: raw }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    const qty = Number(values.quantity);
    const rlv = Number(values.reorderLevel);

    if (enforceAboveReorder && Number.isFinite(qty) && Number.isFinite(rlv)) {
      if (qty < rlv) {
        setLocalError("Quantity must be greater than or equal to the Reorder Level.");
        return;
      }
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="inv-form">
      {/* --- Row 1: Item Code & Name --- */}
      <div className="form-row two-cols">
        <div className="form-field">
          <label htmlFor="itemCode">Item Code</label>
          <input
            id="itemCode"
            type="text"
            placeholder="e.g. ITM-001"
            value={values.itemCode}
            onChange={handleChange("itemCode")}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Office Chair"
            value={values.name}
            onChange={handleChange("name")}
            required
          />
        </div>
      </div>

      {/* --- Row 2: Description (3 lines, spans both columns) --- */}
      <div className="form-row">
        <div className="form-field span-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            placeholder="Short description (material, color, size, etc.)"
            value={values.description}
            onChange={handleChange("description")}
            className="three-lines"
          />
        </div>
      </div>

      {/* --- Row 3: Units Count & Unit Price --- */}
      <div className="form-row two-cols">
        <div className="form-field">
          <label htmlFor="unitsCount">Units</label>
          <input
            id="unitsCount"
            type="text"
            placeholder="e.g. pcs, kg, box"
            value={values.unitsCount}
            onChange={handleChange("unitsCount")}
          />
        </div>
        <div className="form-field">
          <label htmlFor="unitPrice">Unit Price</label>
          <input
            id="unitPrice"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="e.g. 2500.00"
            value={values.unitPrice}
            onChange={handleNumberChange("unitPrice")}
          />
        </div>
      </div>

      {/* --- Row 4: Reorder Level & Quantity --- */}
      <div className="form-row two-cols">
        <div className="form-field">
          <label htmlFor="reorderLevel">Reorder Level</label>
          <input
            id="reorderLevel"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 10"
            value={values.reorderLevel}
            onChange={handleNumberChange("reorderLevel")}
          />
        </div>

        <div className="form-field">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 25"
            value={values.quantity}
            onChange={handleNumberChange("quantity")}
          />
        </div>
      </div>

{/* --- Row 5: Total Stock Price (Quantity × Unit Price) --- */}
       <div className="form-row two-cols">
        <div className="form-field">
          <label htmlFor="totalStockPrice">Total Stock Price</label>
          
          <input
           id="totalStockPrice"
            type="number"
            step="0.01"
            value={totalStockPrice.toFixed(2)}

            readOnly
            className="readonly"
           title="Total Stock Price = Quantity × Unit Price"
           />
        </div>
        {/* keep the right column empty so Total Stock sits under Reorder Level */}
        <div className="form-field placeholder-col" />
      </div>

      {localError && <div className="notice error" style={{ marginTop: 8 }}>{localError}</div>}

      {/* Actions */}
      <div className="actions" style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button type="submit" className="btn primary">{submitLabel}</button>
        <button type="reset" className="btn subtle" onClick={() => {
          setLocalError("");
          setValues({
            itemCode: "",
            name: "",
            description: "",
            unitsCount: "",
            unitPrice: "",
            reorderLevel: "",
            quantity: "",
          });
        }}>
          Clear
        </button>
      </div>
    </form>
  );
}
