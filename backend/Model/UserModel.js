// backend/Model/UserModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name:    { type: String, required: true },          // ✅ 'required', not 'require'
  email:   { type: String, required: true, lowercase: true, trim: true, unique: true },
  password:{ type: String, required: true },          // ✅ 'password' (not 'psssword')
  address: { type: String, required: true },
  phone:   { type: String, required: true },
  role:    { type: String, enum: ["admin","user","inventoryOfficer"], default: "user" } // role support
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
