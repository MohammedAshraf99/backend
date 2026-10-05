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
router.post("/upload-image", upload.array("images", 5), productController.uploadImage);
router.delete("/delete-image", productController.deleteImage);
router.get("/count", productController.getCategoriesCount);
router.route("/deals").get(productController.getDealsProducts);
router.route("/sale").get(productController.saleProducts);

// 2. Base Collection Routes (المسار الرئيسي /)
router.route("/")
  .get(productController.getProducts)
  .post(productController.createProduct);

// 3. Category Dynamic Route (مسار الفئات الديناميكي)
router.get("/category/:category", productController.getProducts);

// 4. Param Dynamic Route (مسار الـ ID الديناميكي - يجب وضعه في النهاية)
router.route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);





module.exports = router;
