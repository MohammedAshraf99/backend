  const mongoose = require("mongoose");

const perfumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Perfume name is required"],
      trim: true,
    },
    isSale:{type:Boolean,default:false},
    deal:{type:Boolean,default:false},
    salePrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    description:{type:String,
defult:"There is no description available for this product"
    },
     categoryName:{
    type: String,
    default: 'perfumes'
  },
    tags: {
      type: [String],
      required: true,
    },
    concentration: {
      type: String,
      required: true,
      enum: ["Extrait de Parfum", "Eau de Parfum", "Eau de Toilette"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
 type: [String],
  required: [true, "At least one image is required"]    },

     size: {
      type: [String],
      required: [true, "Bottle size is required"],
     }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Perfume", perfumeSchema);
