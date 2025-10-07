// backend/Model/InventoryLogModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const actorSchema = new Schema(
  {
    _id: String,
    name: String,
    email: String,
    role: String,
  },
  { _id: false }
);

const inventoryLogSchema = new Schema(
  {
    action: { type: String, enum: ["create", "update", "adjust", "delete"], required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
    itemCode: String,
    name: String,
    description: String,
    unitsCount: String,
    unitPrice: Number,
    reorderLevel: Number,
    quantity: Number,

    // extra info for certain actions
    deltaQuantity: Number, // for adjust
    before: Schema.Types.Mixed, // optional snapshot before update
    after: Schema.Types.Mixed,  // optional snapshot after update

    changedBy: actorSchema,     // who did it (from req.user)
    changedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ changedAt: -1 });
inventoryLogSchema.index({ action: 1, itemCode: 1 });

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);
