// backend/controller/InventoryControllers.js
const InventoryItem = require("../Model/InventoryModel");

// GET /inventory






// const getAllItems = async (req, res) => {
//   try {
//     const items = await InventoryItem.find().sort({ createdAt: -1 });
//     return res.status(200).json({ items });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Failed to fetch inventory" });
//   }
// };








const getAllItems = async (req, res) => {
  try {
    const {
      q,
      itemCode,
      name,
      unitsCount,
      minPrice,
      maxPrice,
      minReorder,
      maxReorder,
      minQty,
      maxQty,
      sort,
      page = 1,
      limit = 100, // generous default
    } = req.query;

    const filter = {};

    // Per-field string filters (case-insensitive)
    if (itemCode)   filter.itemCode   = { $regex: itemCode, $options: "i" };
    if (name)       filter.name       = { $regex: name, $options: "i" };
    if (unitsCount) filter.unitsCount = { $regex: unitsCount, $options: "i" };

    // Numeric ranges
    if (minPrice || maxPrice) {
      filter.unitPrice = {};
      if (minPrice) filter.unitPrice.$gte = Number(minPrice);
      if (maxPrice) filter.unitPrice.$lte = Number(maxPrice);
    }
    if (minReorder || maxReorder) {
      filter.reorderLevel = {};
      if (minReorder) filter.reorderLevel.$gte = Number(minReorder);
      if (maxReorder) filter.reorderLevel.$lte = Number(maxReorder);
    }
    if (minQty || maxQty) {
      filter.quantity = {};
      if (minQty) filter.quantity.$gte = Number(minQty);
      if (maxQty) filter.quantity.$lte = Number(maxQty);
    }

    // Global query "q" — matches strings by regex; if q parses as a number, also matches numeric fields exactly
    if (q && String(q).trim().length) {
      const regex = { $regex: String(q).trim(), $options: "i" };
      const n = Number(q);
      const numericOr = Number.isFinite(n)
        ? [{ unitPrice: n }, { reorderLevel: n }, { quantity: n }]
        : [];

      filter.$or = [
        { itemCode: regex },
        { name: regex },
        { description: regex },
        { unitsCount: regex },
        ...numericOr,
      ];
    }

    // Sort
    let sortObj = { createdAt: -1 };
    if (sort) {
      // expects "field:asc|desc"
      const [field, dir] = String(sort).split(":");
      if (field) {
        sortObj = { [field]: (dir === "asc" ? 1 : -1) };
      }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      InventoryItem.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      InventoryItem.countDocuments(filter),
    ]);

    return res.status(200).json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch inventory" });
  }
};






// Low stock level
const getLowStock = async (req, res) => {
  try {
    const items = await InventoryItem.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    }).sort({ itemCode: 1 });
    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch low-stock items" });
  }
};

// GET /inventory/:id
const getById = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.status(200).json({ item });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch item" });
  }
};

// POST /inventory
const addItem = async (req, res) => {
  const { itemCode, name, description, unitsCount, unitPrice, reorderLevel, quantity } = req.body;
  try {
    const item = new InventoryItem({
      itemCode,
      name,
      description,
      unitsCount,
      unitPrice,
      reorderLevel,
      quantity,
    });
    await item.save();
    return res.status(201).json({ item });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Item code already exists" });
    }
    return res.status(400).json({ message: "Unable to add item" });
  }
};

// PUT /inventory/:id
const updateItem = async (req, res) => {
  const { itemCode, name, description, unitsCount, unitPrice, reorderLevel, quantity } = req.body;
  const update = {};
  if (itemCode     !== undefined) update.itemCode = itemCode;
  if (name         !== undefined) update.name = name;
  if (description  !== undefined) update.description = description;
  if (unitsCount   !== undefined) update.unitsCount = unitsCount;
  if (unitPrice    !== undefined) update.unitPrice = unitPrice;
  if (reorderLevel !== undefined) update.reorderLevel = reorderLevel;
  if (quantity     !== undefined) update.quantity = quantity;

  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Unable to update item" });
    return res.status(200).json({ item });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Item code already exists" });
    }
    return res.status(400).json({ message: "Unable to update item" });
  }
};

// DELETE /inventory/:id
const deleteItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Unable to delete item" });
    return res.status(200).json({ item });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete item" });
  }
};





//quntity change
// PATCH /inventory/:id/quantity  (delta can be + or -; never drop below 0)
const adjustQuantity = async (req, res) => {
  try {
    const id = req.params.id;
    const delta = Number(req.body?.delta);

    if (!Number.isFinite(delta)) {
      return res.status(400).json({ message: "delta must be a number" });
    }

    // If decreasing, ensure current quantity >= |delta| (atomic guard)
    const query = { _id: id };
    if (delta < 0) {
      query.quantity = { $gte: Math.abs(delta) };
    }

    const item = await InventoryItem.findOneAndUpdate(
      query,
      { $inc: { quantity: delta } },
      { new: true }
    );

    if (!item) {
      // Either not found OR insufficient stock for the requested decrease
      if (delta < 0) {
        return res.status(400).json({ message: "Insufficient quantity. Cannot go below 0." });
      }
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ item });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to adjust quantity" });
  }
};














// ✅ Export ONCE, at the bottom (after all definitions)
module.exports = {
  getAllItems,
  getLowStock,
  getById,
  addItem,
  updateItem,
  deleteItem,
  adjustQuantity,
};
