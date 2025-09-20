// backend/Model/InventoryModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema({
  itemCode:     { type: String, required: true, unique: true, trim: true },
  name:         { type: String, required: true, trim: true },
  description:  { type: String, default: "" },
  unitsCount:   { type: String, required: true, trim: true }, // e.g., "pcs", "boxes"
  unitPrice:    { type: Number, required: true, min: 0 },
  reorderLevel: { type: Number, required: true, min: 0 },
  quantity:     { type: Number, required: true, min: 0 },
}, { timestamps: true });

inventorySchema.index({ itemCode: 1 });
inventorySchema.index({ name: 1 });
inventorySchema.index({ unitsCount: 1 });
// If you prefer MongoDB text search later (one text index per collection):
// inventorySchema.index({ itemCode: "text", name: "text", description: "text", unitsCount: "text" });



module.exports = mongoose.model("InventoryItem", inventorySchema);
