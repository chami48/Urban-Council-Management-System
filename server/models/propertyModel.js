const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    branch: { type: String, required: true },                      // අයත් කාර්යාලය / උප කාර්යාලය
    division: { type: String, required: true },                    // කොට්ඨාශය
    street: { type: String, required: true },                      // මාර්ගය
    propertyNo: { type: String, required: true, unique: true },    // වරිපනම් අංකය
    });

module.exports = mongoose.model("Property", propertySchema);