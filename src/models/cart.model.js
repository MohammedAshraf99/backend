const mongoose = require("mongoose");
// 1. مخطط عنصر السلة (Cart Item

// 1. مخطط عنصر السلة (Cart Item Schema)
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product", 
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
    user: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    coupon:{type:String},
    
  },
  
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    // Check if product is populated and has a price field
    const price = item.product && item.product.price ? item.product.price : 0;
    return total + price * item.quantity;
  }, 0);
});
module.exports = mongoose.model("Cart", cartSchema);
