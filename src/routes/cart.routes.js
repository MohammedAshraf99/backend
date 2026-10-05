const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
// فرضنا وجود Auth Middleware لحماية السلة للـ Logged-in Users
// const protect = require("../middlewares/auth.middleware");

// router.use(protect); // حماية جميع مسارات السلة

router
  .route("/")
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .put(cartController.updateCart)
  .delete(cartController.clearCart);
router
  .route("/count")
  .get(cartController.getCartCount)

router
  .route("/items/:itemId")
  .put(cartController.updateCartItem)
  .delete(cartController.removeFromCart);

module.exports = router;
