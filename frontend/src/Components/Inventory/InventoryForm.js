import React from "react";

export default function InventoryForm({
  values,
  setValues,
  onSubmit,
  submitLabel = "Save",
  enforceAboveReorder = true, // ⬅️ toggle: Add=true, Edit=false
}) {
  // --- Sanitize helpers ---
  const sanitize = {
    alnumUpper: (s) => s.replace(/[^a-z0-9]/gi, "").toUpperCase(),
    letters: (s) => s.replace(/[^A-Za-z ]/g, ""),
    lettersNoSpace: (s) => s.replace(/[^A-Za-z]/g, ""),
    desc: (s) => s.replace(/[^A-Za-z0-9,.\s]/g, ""),
    digits: (s) => s.replace(/[^\d]/g, ""),
    decimal: (s) => s.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"),
  };

  const onChangeSanitized = (name, raw) => {
    let v = raw;
    switch (name) {
      case "itemCode":     v = sanitize.alnumUpper(raw); break;
      case "name":         v = sanitize.letters(raw); break;
      case "description":  v = sanitize.desc(raw); break;
      case "unitsCount":   v = sanitize.lettersNoSpace(raw); break;
      case "unitPrice":    v = sanitize.decimal(raw); break;
      case "reorderLevel": v = sanitize.digits(raw); break;
      case "quantity":     v = sanitize.digits(raw); break;
      default: break;
    }
    setValues((prev) => ({ ...prev, [name]: v }));
  };

  const blockNonNumericKeys = (allowDecimal = false) => (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    if (!allowDecimal && e.key === ".") e.preventDefault();
  };

  const reorder = Number.parseInt(values.reorderLevel || "0", 10);
  const minQty = enforceAboveReorder
    ? (Number.isInteger(reorder) && reorder >= 0 ? reorder + 1 : 0)
    : 0;

  // 🔹 Calculate total stock price
  const unitPrice = parseFloat(values.unitPrice || "0");
  const quantity = parseInt(values.quantity || "0", 10);
  const totalStockPrice = Number.isFinite(unitPrice * quantity) ? (unitPrice * quantity).toFixed(2) : "0.00";

  return (
    <form className="inv-form" onSubmit={onSubmit}>
      <div className="grid">
        <label>Item Code</label>
        <input
          name="itemCode"
          value={values.itemCode}
          onChange={(e) => onChangeSanitized("itemCode", e.target.value)}
          required
          inputMode="text"
          pattern="[A-Z0-9]+"
          title="Only A–Z and 0–9; will be uppercased"
          placeholder="e.g., ABC123"
        />

        <label>Name</label>
        <input
          name="name"
          value={values.name}
          onChange={(e) => onChangeSanitized("name", e.target.value)}
          required
          inputMode="text"
          pattern="[A-Za-z ]+"
          title="Letters and spaces only"
          placeholder="e.g., Ball Box"
        />

        <label>Description</label>
        <input
          name="description"
          value={values.description}
          onChange={(e) => onChangeSanitized("description", e.target.value)}
          inputMode="text"
          pattern="[A-Za-z0-9,.\s]*"
          title="Letters, numbers, comma, period only"
          placeholder="Optional"
        />

        <label>Units Count</label>
        <input
          name="unitsCount"
          value={values.unitsCount}
          onChange={(e) => onChangeSanitized("unitsCount", e.target.value)}
          required
          inputMode="text"
          pattern="[A-Za-z]+"
          title="Letters only (e.g., pcs, boxes)"
          placeholder="pcs"
        />

        <label>Unit Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          name="unitPrice"
          value={values.unitPrice}
          onChange={(e) => onChangeSanitized("unitPrice", e.target.value)}
          onKeyDown={blockNonNumericKeys(true)}
          required
          placeholder="0.00"
          title="Numbers only (decimals allowed)"
        />

        <label>Reorder Level</label>
        <input
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          name="reorderLevel"
          value={values.reorderLevel}
          onChange={(e) => onChangeSanitized("reorderLevel", e.target.value)}
          onKeyDown={blockNonNumericKeys(false)}
          required
          placeholder="e.g., 10"
          title="Integers only (≥ 0)"
        />

        <label>Quantity</label>
        <div>
          <input
            type="number"
            min={minQty}
            step="1"
            inputMode="numeric"
            name="quantity"
            value={values.quantity}
            onChange={(e) => onChangeSanitized("quantity", e.target.value)}
            onKeyDown={blockNonNumericKeys(false)}
            required
            placeholder={enforceAboveReorder ? `>${reorder || 0}` : "0 or more"}
            title={enforceAboveReorder ? `Integers only (> ${reorder || 0})` : "Integers only (≥ 0)"}
          />
          {enforceAboveReorder && (
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Must be greater than reorder level ({reorder || 0})
            </div>
          )}
        </div>

        {/* 🔹 New box for Total Stock Price */}
        <label>Total Stock Price</label>
        <input
          type="text"
          value={totalStockPrice}
          readOnly
          style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  );
}
