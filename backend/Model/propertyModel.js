const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    branch: { type: String, required: true },                      
    division: { type: String, required: true },                    
    street: { type: String, required: true },                      
    propertyNo: { type: String, required: true, unique: true },    
    });

module.exports = mongoose.model("Property", propertySchema);