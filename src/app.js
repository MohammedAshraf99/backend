const express = require("express");
const cors = require("cors");
// const errorHandler = require("./middlewares/error.middleware");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const UserRoutes = require("./routes/user.route");
const bannerRoutes = require("./routes/banner.routes");
const promoBannerRoutes = require("./routes/promobanner.routes");
const AnnouncementRoutes = require("./routes/announcement.routes");
const paymentRoutes = require("./routes/payment.routes"); // تأكد من مسار الملف الصحيح
const couponRoutes = require("./routes/coupon.routes");
const multer = require("multer");
const path = require("path");
const app = express();
const applySecurity = require("../security");

applySecurity(app);

app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/promo-banners", promoBannerRoutes);
app.use("/api/announcements", AnnouncementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/coupons", couponRoutes);


app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack || err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
