require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Routers
const userRouter = require("./Route/UserRoute");
const crematoriumRouter = require("./Route/CrematoriumRoute");
const assessmentRouter = require("./Route/assessmentRoute");
const propertyRouter = require("./Route/propertyRoute");
const complaintRouter = require("./Route/ComplaintsRoutes");
const announcementRouter = require("./Route/announcementRoutes");
const paymentRouter = require("./Route/paymentRoute");
const taxRouter = require("./Route/taxRoute");
const shopApplicationRoutes = require("./Route/shopApplicationRoute");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder (if you need file uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/users", userRouter);
app.use("/crematorium", crematoriumRouter);
app.use("/assessments", assessmentRouter);
app.use("/properties", propertyRouter);
app.use("/complaints", complaintRouter);
app.use("/announcements", announcementRouter);
app.use("/payments", paymentRouter);
app.use("/calculateTax", taxRouter);
app.use("/api/shop-applications", shopApplicationRoutes);



// Database + Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
