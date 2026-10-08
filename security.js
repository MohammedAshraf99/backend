const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const express = require("express");

const applySecurity = (app) => {
  // 1. إخفاء معلومات البيئة والسيرفر
  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // يمنع حظر الموارد ذات المصادر المختلفة عند التخزين الموقت
      crossOriginResourcePolicy: { policy: "cross-origin" }, // يسمح بتحميل الصور والملفات عبر Domains مختلفة
    }),
  );

  // 2. إعدادات CO  RS المتكاملة
  const allowedOrigins = [
    process.env.CLIENT_URL,
 'https://www.k11perfumes.co.uk',
 
].filter(Boolean); // إزالة القيم الفارغة إن لم تتوافر البيئة

  const corsOptions = {
    origin: (origin, callback) => {
      // السماح للطلبات بدون Origin (مثل Postman) أو النطاقات المعتمدة
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-guest-id"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options("/*path", cors(corsOptions)); // معالجة Preflight لجميع المسارات

  // 3. تحديد معدل الطلبات (Rate Limiting)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
  app.use("/api", globalLimiter);

  // 4. معالجة وتطوير أجسام الطلبات والوقاية من الثغرات
  app.use(express.json({ limit: "20kb" }));
  app.use(express.urlencoded({ extended: true, limit: "20kb" }));
  app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query); // ينظف الخصائص الداخلية دون إعادة كتابة req.query نفسه
    next();
  });
  app.use(hpp());
};

module.exports = applySecurity;
