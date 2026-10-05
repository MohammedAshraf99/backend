const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // count:{
    //   type:Number,
    //   defult:1,

    // },
    price: {
      type: Number,
      required: true,
      min: [0],
    },
    salePrice: {
      type: Number,
      min: [0],
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    deal: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "No description available for this Product",
    },
    image: {
      type: [String],
      required: [true, "have to add a picture"],
    },
    tags: {
      type: [String],
      default: [],
    },

    // (Balloons)
    colors: {
      type: [String],
      default: [],
    },

    // (Gifts)
    occasion: {
      type: String,
      trim: true,
    },
    boxContents: {
      type: [String],
      default: [],
    },

    // (Perfumes)
    concentration: {
      type: String,
 },
    size: {
      type: String,
    },
  },
  { timestamps: true },
);

// ==========================================
//(Dynamic Validation)
// ==========================================
productSchema.path("category").validate(function () {
  if (this.category === "gifts" && !this.occasion) {
    throw new Error("ocasion is required when made gift product");
  }
  return true;
});



module.exports = mongoose.model("Product", productSchema);
