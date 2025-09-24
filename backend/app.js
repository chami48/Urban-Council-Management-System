require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const { parseCookies, getSession } = require("./sessionLite");

// Routers
const playgroundRouter = require("./Route/PlaygroundRoute");
const crematoriumRouter = require("./Route/CrematoriumRoute");
const assessmentRouter = require("./Route/assessmentRoute");
const propertyRouter = require("./Route/propertyRoute");
const complaintRouter = require("./Route/ComplaintsRoutes");
const announcementRouter = require("./Route/announcementRoutes");
const taxRouter = require("./Route/taxRoute");
const shopApplicationRoute = require("./Route/shopApplicationRoute");
const userRouter = require("./Route/UserRoute");
const authRouter = require("./Route/AuthRoute");
const inventoryRouter = require("./Route/InventoryRoute");
const inventoryLogRouter = require("./Route/InventoryLogRoute");

const paymentRoutes = require('./Route/paymentRoutes');
const shopPaymentRoute = require("./Route/shopPaymentRoute");
const paymentRouter = require("./Route/taxPaymentRoute");

const app = express();

// Middleware
app.use(express.json());
//app.use(cors());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use((req, res, next) => {
  req.cookies = parseCookies(req);
  next();
});

// (optional) attach current session info (not required for requireAuth)
app.use((req, res, next) => {
  const sid = req.cookies.sid;
  const sess = sid ? getSession(sid) : null;
  req.session = sess || null;
  next();
});

// Static folder (if you need file uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/playgrounds", playgroundRouter);
app.use("/crematorium", crematoriumRouter);
app.use("/assessments", assessmentRouter);
app.use("/properties", propertyRouter);
app.use("/complaints", complaintRouter);
app.use("/announcements", announcementRouter);
app.use("/payments", paymentRouter);
app.use("/calculateTax", taxRouter);
app.use("/api/shop-applications", shopApplicationRoute);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventory-logs", inventoryLogRouter); 
app.use('/api/payment', paymentRoutes);
app.use("/api/shop-payment", shopPaymentRoute);


// Database + Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
