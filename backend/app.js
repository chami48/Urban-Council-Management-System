require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Route/UserRoute");
const crematoriumRouter = require("./Route/CrematoriumRoute");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve uploads folder as static files
// Now any file in /uploads can be accessed at http://localhost:5000/uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/users", userRouter);
app.use("/crematorium", crematoriumRouter);

// Database connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => console.log("❌ Connection error:", err));
