const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    assessmentNo: { type: String, required: true, unique: true },   // ඇගයීම් අංකය
    division: { type: String, required: true },                     // අංශය
    street: { type: String, required: true },                       // වීදිය
    propertyNo: { type: String, required: true },                   // ගොඩනැගිල්ල අංකය
    ownerName: { type: String, required: true },                    // හිමිකරුගේ නම
    ownerNIC: { type: String, required: true },                     // හිමිකරුගේ ජාතික හැඳුනුම්පත් අංකය
    contactNo: { type: String, required: true }, 
    description:{type:String, required: true},                   // සම්බන්ධතා අංකය
    propertyType: { type: String, enum: ["Bussiness", "House"], required: true }, // ගොඩනැගිල්ලේ වර්ගය
    appraisedValue: { type: Number, required: true },                  // වාර්ෂික වටිනාකම
    taxRate: { type: Number, required: true },                      // බදු අනුපාතය
    
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" } // තත්ත්වය
});

module.exports = mongoose.model("Assessment", assessmentSchema);