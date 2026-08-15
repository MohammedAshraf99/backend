const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: [true],
    },
    ctaLink: {
      type: String,
      default: "/perfume",
    },
    ctaText: {
      type: String,
      default: "Shop Now",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0, // للتحكم في ترتيب عرض البانرات داخل الـ Carousel
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
  },
);

module.exports = mongoose.model("PromoBanner", bannerSchema);
