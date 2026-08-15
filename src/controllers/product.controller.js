const Balloon = require("../models/balloon.model");
const Gift = require("../models/gift.model");
const Perfume = require("../models/perfume.model");

// خريطة لتحديد الموديل المناسب بناءً على نوع المنتج في الـ URL
const getModel = (type) => {
  switch (type) {
    case "balloons":
      return Balloon;
    case "gifts":
      return Gift;
    case "perfumes":
      return Perfume;
    default:
      return null;
  }
};

// 1. Create - إضافة منتج جديد
exports.createProduct = async (req, res, next) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model)
      return res
        .status(400)
        .json({ success: false, message: "Invalid product type" });

    const product = await Model.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 2. Read All -  جلب جميع المنتجات لكتاجوري معين
exports.getAllProductsByCategory = async (req, res, next) => {
  let products;
  try {
    const Model = getModel(req.params.type);
    if (!Model)
      return res
        .status(400)
        .json({ success: false, message: "Invalid product type" });

      if(req.params.type == 'sale'){
        const [balloons, gifts, perfumes] = await Promise.all([
      Balloon.find({isSale: true}),
      Gift.find({isSale: true}),
      Perfume.find({isSale: true}),
      ]);
      products = [...balloons, ...gifts, ...perfumes];
        }else{
      products = await Model.find();
        }
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// 3. Read All - جلب جميع المنتجات
exports.getAllProducts = async (req, res, next) => {
  try {
    // 1. تنفيذ الاستعلامات الثلاثة بالتوازي لتوفير الوقت والسرعة
    const [balloons, gifts, perfumes] = await Promise.all([
      Balloon.find(),
      Gift.find(),
      Perfume.find(),
    ]);
    // 2. تجميع كل المنتجات في مصفوفة واحدة
    const products = [...balloons, ...gifts, ...perfumes];

    // 3. إرجاع الرد للـ Frontend
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    // تمرير الخطأ للـ Error Middleware
    next("error");
  }
};

// 4. Read Single - جلب منتج واحد بالتفصيل
exports.getProductById = async (req, res, next) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model)
      return res
        .status(400)
        .json({ success: false, message: "Invalid product type" });

    const product = await Model.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 5. Update - تعديل منتج
exports.updateProduct = async (req, res, next) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model)
      return res
        .status(400)
        .json({ success: false, message: "Invalid product type" });

    const product = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// مسار لجلب المنتجات التي عليها عرض فقط
exports.dealProduct = async (req, res, next) => {
  try {
    // جلب المنتجات حيث تكون قيمة deal تساوي true
    const [balloons, gifts, perfumes] = await Promise.all([
      Balloon.find({ deal: true }),
      Gift.find({ deal: true }),
      Perfume.find({ deal: true }),
    ]);
    // 2. تجميع كل المنتجات في مصفوفة واحدة

    const dealProducts = [...balloons, ...gifts, ...perfumes];
    // إرجاع المنتجات كـ JSON للـ Frontend
    res.status(200).json({ status: "success", data: dealProducts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء جلب العروض", error: error.message });
  }
};

exports.saleProduct = async (req, res, next) => {
  try {
    // جلب المنتجات حيث تكون قيمة deal تساوي true
    const [balloons, gifts, perfumes] = await Promise.all([
      Balloon.find({ isSale: true }),
      Gift.find({ isSale: true }),
      Perfume.find({ isSale: true }),
    ]);
    // 2. تجميع كل المنتجات في مصفوفة واحدة

    const SaleProducts = [...balloons, ...gifts, ...perfumes];
    // إرجاع المنتجات كـ JSON للـ Frontend
    res.status(200).json(SaleProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء جلب التخفضيات", error: error.message });
  }
};

// 6. Delete - حذف منتج
exports.deleteProduct = async (req, res, next) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model)
      return res
        .status(400)
        .json({ success: false, message: "Invalid product type" });

    const product = await Model.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const imagesPaths = req.files.map((file) => `/public/${file.filename}`);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      imageUrl: imagesPaths,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body; // Expecting string e.g., "/public/image-123.jpg" or array of URLs

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL or path is required" });
    }

    // Handle single string or array of URLs
    const urlArray = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

    urlArray.forEach((url) => {
      // Clean leading slashes and extract relative path
      const relativePath = url.startsWith("/") ? url.substring(1) : url;

      // Construct absolute file path on disk
      const filePath = path.join(__dirname, "..", relativePath);

      // Check if file exists before attempting to delete
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({
      success: true,
      message: "Image(s) deleted successfully from server storage",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductCount = async (req, res, next) => {
  try {
    // 1. تنفيذ الاستعلامات الثلاثة بالتوازي لتوفير الوقت والسرعة
    const [balloons, gifts, perfumes] = await Promise.all([
      Balloon.find(),
      Gift.find(),
      Perfume.find(),
    ]);
    const [balloonsSale, giftsSale, perfumesSale] = await Promise.all([
      Balloon.find({ isSale: true }),
      Gift.find({ isSale: true }),
      Perfume.find({ isSale: true }),
    ]);

    // 2. تجميع كل المنتجات في مصفوفة واحدة
    const productsCount = [
      {
        name: "all",
        count: perfumes.length + balloons.length + gifts.length || 0,
      },
      { name: "perfumes", count: perfumes.length || 0 },
      { name: "balloons", count: balloons.length || 0 },
      { name: "gifts", count: gifts.length || 0 },
      {
        name: "sale",
        count: balloonsSale.length + giftsSale.length + giftsSale.length || 0,
      },
    ];

    // 3. إرجاع الرد للـ Frontend
    res.status(200).json({
      success: true,
      categoryCount: productsCount,
    });
  } catch (error) {
    // تمرير الخطأ للـ Error Middleware
    next(error);
  }
};
