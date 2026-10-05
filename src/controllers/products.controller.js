const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

/**
 * @desc    Get products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      isSale,
      deal,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) filter.categoryName = category.toLowerCase();
    if (isSale !== undefined) filter.isSale = isSale === "true";
    if (deal !== undefined) filter.deal = deal === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortBy = { createdAt: -1 };
    if (sort === "price-asc") sortBy = { price: 1 };
    if (sort === "price-desc") sortBy = { price: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalItems: total,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        pageSize: products.length,
      },
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
    console.log("product")
  
  try {
    const product = await Product.findById(req.params.id);
    console.log(product)

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
    // runValidators executes Schema validations on update
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returns the document after update
        runValidators: true, // Applies validation rules during update
      }
    );

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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found to delete",
      });
    }

    // 2. Remove product from all carts containing it
    
    return res.status(200).json({
      success: true,
      message: "The product was deleted successfully",
      deletedProductId: req.params.id,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: error.message,
    });
  }
};