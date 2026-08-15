const mongoose = require("mongoose");

// 1. مخطط عنصر السلة (Cart Item)
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "items.productModel", // ربط ديناميكي حسب نوع موديل المنتج
  },
  productModel: {
    type: String,
    required: true,
    // 👇 تم إضافة Hot Deals لتتوافق مع الأقسام السابقة
    enum: ["Perfume", "Gift", "Balloon", "hot deals"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

// 2. مخطط السلة الرئيسي (Cart Schema)
const cartSchema = new mongoose.Schema(
  {
    // 👇 يمكن أن يكون ID مستخدم مسجل أو Guest ID (مثال: guest_a1b2c3d4)
    user: {
      type: String,
      required: true,
      unique: true, // سلة واحدة فقط لكل زائر أو مستخدم
      index: true, // تحسين سرعة البحث بـ Guest ID
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

// حساب إجمالي عدد العناصر في السلة تلقائياً (Virtual Property)
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
