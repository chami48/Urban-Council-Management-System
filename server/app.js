const express = require("express");
const mongoose = require("mongoose");
const cardRouter = require("./routes/cardRoute");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route
app.use("/cards", cardRouter);

// Connect DB
mongoose.connect("mongodb+srv://finance_123:finance_123Dilmi@cluster0.rtvthnv.mongodb.net/payment")
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(5001);
})
.catch((err) => console.log(err));
