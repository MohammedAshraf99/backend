const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const multer = require("multer");
const upload = require("../middlewares/upload.middleware");


router.get("/", bannerController.getAllBanners);
router.post("/",upload.single('image'),bannerController.createBanner);
router.put("/:id", bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
