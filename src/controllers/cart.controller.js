const Cart = require("../models/cart.model");

// 🛠️ دالة مساعدة لاستخراج الـ ID الموحد (مستخدم مسجل أو زائر)
const getCartIdentifier = (req) => {
  // إذا كان المستخدم مسجّل دخول وبها Auth Middleware
  // if (req.user && req.user.id) {
  //   return req.user.id;
  // }
  // إذا كان زائراً، نأخذ الـ guestId من query, params, body, أو headers
  return req.headers["x-guest-id"];
};

// 1. Get Cart - جلب سلة الشراء (للمسجل أو الزائر)
exports.getCart = async (req, res, next) => {
  try {
    const guestId = req.query.guestId;
    const userId = req.user ? req.user.id : guestId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json({ success: true, data: cart, count: cart.totalItems });
  } catch (error) {
    next(error);
  }
};

// 2. Add Item to Cart - إضافة منتج لسلة الشراء
exports.addToCart = async (req, res, next) => {
  try {
    const modelMapping = {
      perfumes: "Perfume",
      perfume: "Perfume",
      gifts: "Gift",
      gift: "Gift",
      balloons: "Balloon",
      balloon: "Balloon",
      hotdeals: "HotDeals",
      "hot-deals": "HotDeals",
      hot_deals: "HotDeals",
      "hot deals": "HotDeals",
    };

    const cartId = getCartIdentifier(req);
    let { productId, productModel, quantity } = req.body;
    if (productModel && modelMapping[productModel.toLowerCase()]) {
      productModel = modelMapping[productModel.toLowerCase()];
    }
    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    let cart = await Cart.findOne({ user: cartId });

    if (!cart) {
      cart = new Cart({ user: cartId, items: [] });
    }

    // التحقق مما إذا كان المنتج بذات الخصائص موجوداً بالفعل في السلة
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // زيادة الكمية إذا كان المنتج موجوداً بنفس الخصائص
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // إضافة المنتج كعنصر جديد
      cart.items.push({
        product: productId,
        productModel,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// 3. Update Item Quantity - تعديل كمية عنصر محدد في السلة
exports.updateCartItem = async (req, res, next) => {
  try {
    const cartId = getCartIdentifier(req);
    const { itemId } = req.params;
    const { quantity } = req.body;
    const  guestID  = req.headers;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: cartId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// 4. Remove Item - حذف عنصر من السلة
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }
    const cart = await Cart.findOne({
      user: "guest_1c8f9453-a515-4339-9fdf-227f3e627f8a",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// 5. Clear Cart - تفريغ السلة بالكامل بعد الشراء
exports.clearCart = async (req, res, next) => {
  try {
    const cartId = getCartIdentifier(req);

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: cartId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
exports.getCartCount = async (req, res, next) => {
  try {
    // const cartId = getCartIdentifier(req);
    // if (!cartId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User ID or Guest ID is required",
    //   });
    // }

    const cart = await Cart.findOne({ user: req.query.guestId });
    res.status(200).json({ count: cart.totalItems });
  } catch (error) {
    next(error);
  }
};
