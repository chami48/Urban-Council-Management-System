import React from "react";

export default function InventoryForm({ values, setValues, onSubmit, submitLabel = "Save" }) {
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (

    
    <form className="inv-form" onSubmit={onSubmit}>
      <div className="grid">
        <label>Item Code</label>
        <input name="itemCode" value={values.itemCode} onChange={onChange} required />

        <label>Name</label>
        <input name="name" value={values.name} onChange={onChange} required />

        <label>Description</label>
        <input name="description" value={values.description} onChange={onChange} />

        <label>Units Count</label>
        <input name="unitsCount" value={values.unitsCount} onChange={onChange} placeholder="e.g., pcs, boxes" required />

        <label>Unit Price</label>
        <input type="number" min="0" step="0.01" name="unitPrice" value={values.unitPrice} onChange={onChange} required />

        <label>Reorder Level</label>
        <input type="number" min="0" name="reorderLevel" value={values.reorderLevel} onChange={onChange} required />

        <label>Quantity</label>
        <input type="number" min="0" name="quantity" value={values.quantity} onChange={onChange} required />
      </div>

      <div className="actions">
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  );
}
