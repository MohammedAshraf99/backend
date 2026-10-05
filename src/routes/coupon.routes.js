const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/Coupon.controller");

// Public Validation Route
router.post("/validate", validateCoupon);

// CRUD Routes (Admin)
router.route("/").post(createCoupon).get(getAllCoupons);

router.route("/:id").get(getCouponById).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
