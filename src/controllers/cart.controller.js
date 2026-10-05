const Cart = require("../models/cart.model");

// 🛠️ دالة مساعدة موحدة لجلب الـ User/Guest ID من الطلب
const getUserIdentifier = (req) => {
  return (
    req.user?.id ||
    req.query.guestId ||
    req.headers["x-guest-id"] ||
    req.body.guestId
  );
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = getUserIdentifier(req);

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

// 2. Add Item to Cart - إضافة منتج للسلة
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity) || 1,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res
      .status(200)
      .json({
        success: true,
        data: cart,
        message: "Product added successfully",
      });
  } catch (error) {
    next(error);
  }
};

// 3. Update Item Quantity - تعديل كمية عنصر محدد
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
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

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.updateCart= async (req, res, next) => {
  try {
    const { coupon } = req.body;
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    await cart.updateOne({coupon});
    console.log(cart)
    await cart.save();

    res.status(200).json({ success: true,data:cart});
  } catch (error) {
    next(error);
  }
};

// 4. Remove Item - حذف عنصر من السلة
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
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

// 5. Clear Cart - تفريغ السلة بالكامل
exports.clearCart = async (req, res, next) => {
  try {
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID or Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.coupon = "";

      await cart.save();
    }

    res.status(200)
      .json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 6. Get Cart Count - إجمالي عدد عناصر السلة
exports.getCartCount = async (req, res, next) => {
  try {
    const userId = getUserIdentifier(req);

    if (!userId) {
      return res.status(200).json({ count: 0 });
    }

    const cart = await Cart.findOne({ user: userId });
    res.status(200).json({ count: cart ? cart.totalItems : 0 });
  } catch (error) {
    next(error);
  }
};
