const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

/**
 * @desc    Get products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const category = req.params.category;
   let products
    if (category) {
      console.log(category);
       products = await Product.find({ category: category.toLowerCase() });
    } else {
       products = await Product.find();
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
};

exports.getDealsProducts = async (req, res) => {
  try {
       products = await Product.find({deal:true});
  
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
};

exports.saleProducts = async (req, res) => {
  try {
       products = await Product.find({isSale:true});
  
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product details by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};
/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    console.log(req.body)
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "The product was created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update product details
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
  try {


    const { id } = req.params;
    const { active } = req.body;

    if (active === false) {
      await Cart.updateMany(
        { 'items.product': id },
        { $pull: { items: { product: id } } }
      );
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the document after update
      runValidators: true, // Applies validation rules during update
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "The product was updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred while updating the product",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
 try {
  const { id } = req.params; // استخراج المتغير بشكل صريح

  // 1. حذف المنتج من قاعدة البيانات
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found to delete",
    });
  }

  // 2. حذف المنتج من جميع السلات التي تحتويه
  await Cart.updateMany(
    { 'items.product': id },
    { $pull: { items: { product: id } } }
  );

  return res.status(200).json({
    success: true,
    message: "The product was deleted successfully",
    deletedProductId: id,
  });
} catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: error.message,
    });
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

exports.getCategoriesCount = async (req, res, next) => {
  try {
    const categoriesCount = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      {
        $sort: { category: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: [...categoriesCount],
    });
  } catch (error) {
    next(error);
  }
};
