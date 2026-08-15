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
// 1. تحديد قائمة الدومينات المسموح لها بالاتصال
const allowedOrigins = [
  'https://k11-tan.vercel.app',
  'http://localhost:4200'
];

// إضافة CLIENT_URL إن وجد في متغيرات البيئة بدون تكرار
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// 2. إعدادات مكتبة CORS
const corsOptions = {
  origin: function (origin, callback) {
    // السماح للطلبات التي تأتي بدون Origin (مثل Postman أو Server-to-Server) أو الطلبات من القائمة
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-id'],
  optionsSuccessStatus: 200 // متوافق مع بعض المتصفحات القديمة
};

// 3. تطبيق الـ Middlewares
app.use(cors(corsOptions));
app.options('/*splat', cors(corsOptions)); // معالجة طلبات Preflight لجميع المسارات

app.use(express.json());



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
