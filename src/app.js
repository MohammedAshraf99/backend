const express = require("express");
const cors = require("cors");
// const errorHandler = require("./middlewares/error.middleware");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const bannerRoutes = require('./routes/banner.routes')
const promoBannerRoutes = require('./routes/promobanner.routes')

const multer = require("multer");
const path = require("path");

const app = express();
// 1. Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
  }),
);
app.use("/public", express.static(path.join(__dirname, "../public")));
// 2. إعداد مكتبة Multer لتحديد اسم ومجلد حفظ الصور

// 2. Sample Route Test
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "API is running successfully!" });
});

// 3. Error Handling Middleware
// app.use(errorHandler);

// ... باقي الـ Middlewares ...

// تفعيل المسارات
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/promo-banners", promoBannerRoutes);


module.exports = app;
