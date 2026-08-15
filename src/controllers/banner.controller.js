const banner = require("../models/banner.model");

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await banner.find(); // أو banner.find({})
    return res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("🔥 Error in getAllBanners:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Perfume image is required" });
    }

    // 2. الحصول على اسم الملف الذي تم إنشاؤه وحفظه بواسطة Multer
    const filename = req.file.filename;

    // 3. إنشاء البانر في قاعدة البيانات
    const newBanner = await banner.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      discountTag: req.body.discountTag,
      ctaLink: req.body.ctaLink || "/perfumes",
      ctaText: req.body.ctaText || "Shop Now",
      imageUrl: `http://localhost:3000/public/${filename}`,
    });

    return res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const filename = `perfume-banner-${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(__dirname, "../uploads", filename);

      await imageFile.mv(uploadPath);
      updateData.imageUrl = `http://localhost:3000/uploads/${filename}`;
    }

    const updatedBanner = await banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    return res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await banner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
