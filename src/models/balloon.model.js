const mongoose = require("mongoose");

const balloonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Balloon name is required"],
      trim: true,
    },
    categoryName: {
      type: String,
      default: "balloons",
    },
    deal: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    salePrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    description: { type: String },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: [String],
      required: [true, "At least one image is required"],
    },

    tags: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String], // Array of Tailwind color strings
      default: [],
    },
    // heliumReady: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Balloon", balloonSchema);
