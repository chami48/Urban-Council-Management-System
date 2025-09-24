// models/Property.js
const mongoose = require("mongoose");

const multiLangString = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    si: { type: String, default: "" },
    ta: { type: String, default: "" },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema({
  branch: { type: multiLangString, required: true },
  division: { type: multiLangString, required: true },
  street: { type: multiLangString, required: true },
  propertyNo: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Property", propertySchema);
