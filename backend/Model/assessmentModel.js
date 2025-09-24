const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    assessmentNo: { type: String, required: true, unique: true },   
    division: { type: String, required: true },                    
    street: { type: String, required: true },                       
    propertyNo: { type: String, required: true },                  
    ownerName: { type: String, required: true },                   
    ownerNIC: { type: String, required: true },                    
    description:{type:String, required: true},                   
    propertyType: { type: String, enum: ["Bussiness", "House"], required: true }, 
    appraisedValue: { type: Number, required: true },                 
    taxRate: { type: Number, required: true },                      
    
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" } 
});

module.exports = mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
