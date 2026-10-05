// controllers/couponController.js
const Coupon = require("../models/Coupon.model");

exports.createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      expirationDate,
      usageLimit,
      isActive,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists." });
    }

    const newCoupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      expirationDate,
      usageLimit,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: newCoupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET ALL COUPONS (Admin)
 * GET /api/coupons
 */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    const updatedCoupons = coupons.map((coupon) => {
      coupon.updateExpirationStatus();
      return coupon;
    });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: updatedCoupons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET SINGLE COUPON BY ID
 * GET /api/coupons/:id
 */
exports.getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. UPDATE COUPON (EDIT)
 * PUT /api/coupons/:id
 */
exports.getActivePromo = async (req, res, next) => {
  try {
    const promoCoupon = await Coupon.findOne({
      isActive: true,
      isPromoModal: true,
      expirationDate: { $gt: new Date() },
    }).sort({ updatedAt: -1 });

    if (!promoCoupon) {
      return res.status(200).json(null);
    }

    return res.status(200).json(promoCoupon);
  } catch (error) {
    next(error);
  }
};
exports.updateCoupon = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. DELETE COUPON
 * DELETE /api/coupons/:id
 */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. VALIDATE AND APPLY COUPON
 * POST /api/coupons/validate
 */
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code is required." });
    }

    if (cartAmount === undefined || cartAmount < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid cart amount is required." });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // 1. Check existence
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid coupon code." });
    }

    // 2. Check active status
    if (!coupon.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "This coupon is inactive." });
    }

    // 3. Check expiration date
    if (new Date() > new Date(coupon.expirationDate)) {
      return res
        .status(400)
        .json({ success: false, message: "This coupon has expired." });
    }

    // 4. Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Maximum usage limit reached for this coupon.",
      });
    }

    // 5. Check minimum order amount
    if (cartAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order total to activate this coupon is ${coupon.minOrderAmount}`,
      });
    }

    // 6. Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartAmount * coupon.discountValue) / 100;

      // Cap discount if maxDiscountAmount is configured
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount does not exceed cart value
    discountAmount = Math.min(discountAmount, cartAmount);
    const finalAmount = cartAmount - discountAmount;

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
