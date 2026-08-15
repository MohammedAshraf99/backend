const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

// Endpoint لجلب بيانات البروفايل للمستخدم الحالي
router.get("/profile", protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user, // تم تجهيزه وتوفيره بواسطة الـ protect middleware
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
