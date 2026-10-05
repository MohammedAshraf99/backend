// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isValid: { type: Boolean, default: true }
}, { timestamps: true });

couponSchema.methods.updateExpirationStatus = function() {
  const isExpired = new Date() >= new Date(this.expirationDate);
  const isLimitReached = this.usageLimit !== null && this.usedCount >= this.usageLimit;

  if (isExpired || isLimitReached) {
    this.isActive = false;
    this.isValid = false;
  } else {
    this.isActive = true;
    this.isValid = true;
  }

  return !isExpired && !isLimitReached;
};

couponSchema.pre("save", function() {
  this.updateExpirationStatus();
});
module.exports = mongoose.model("Coupon", couponSchema);