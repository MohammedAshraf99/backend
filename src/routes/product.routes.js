const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");
const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // تأكد من إنشاء مجلد فارغ باسم uploads بجانب ملف server.js
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد بالتوقيت الحالي
//   }
// });

// const upload = multer({ storage: storage });

router.post(
  "/upload-image",
  upload.array("images", 5),
  productController.uploadImage,
);
// المسار: عند إرسال طلب POST، يتم رفع الصورة أولاً باسم 'image' ثم تشغيل دالة الكونترولر
router.delete("/delete-image", productController.deleteImage);
router.route("/all").get(productController.getAllProducts);
router.route("/deals").get(productController.dealProduct);
router.route("/sale").get(productController.saleProduct);

router.route("/count").get( productController.getProductCount);
router
  .route("/:type")
  .get(productController.getAllProductsByCategory)
  .post(productController.createProduct);

router
  .route("/:type/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);


module.exports = router;
