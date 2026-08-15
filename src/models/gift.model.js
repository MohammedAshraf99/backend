const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gift title is required"],
      trim: true,
    },
    categoryName: {
      type: String,
      default: "gifts",
    },
    deal: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },

    occasion: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    salePrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    description: { type: String },
  tags: {
      type: [String],
      required: true,
      defult:'No Tags'
    },
    image: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    boxContents: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Gift", giftSchema);
