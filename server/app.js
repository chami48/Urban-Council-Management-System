const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const assessmentRouter = require("./routes/assessmentRoute");
const propertyRouter = require("./routes/propertyRoute");


const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/assessments", assessmentRouter);
app.use("/properties", propertyRouter);



// DB Connection
mongoose.connect("mongodb+srv://finance_123:finance_123Dilmi@cluster0.rtvthnv.mongodb.net/propertyTax")
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5001, () => console.log("🚀 Server running on port 5001"));
})
.catch((err) => console.log(err));