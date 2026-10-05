const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../config/paypal");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model"); // نموذج الطلبات لديك

exports.captureAndCreateOrder = async (req, res, next) => {
  try {
    const { orderID, shippingAddress, guestId } = req.body;
    const userId = req.user ? req.user.id : guestId;

    if (!userId || !orderID) {
      return res.status(400).json({
        success: false,
        message: "Order ID and User/Guest ID are required",
      });
    }

    // 1. جلب سلة الشراء الخاصة بالمستخدم
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 2. تأكيد وسحب المبلغ من PayPal فعلياً
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const captureResult = await client().execute(request);

    // التأكد من أن عملية الدفع اكتملت بنجاح
    if (captureResult.result.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Payment capture failed on PayPal",
      });
    }

    // 3. إنشاء الطلب الجديد في قاعدة البيانات (Order Creation)
    const totalAmount = captureResult.result.purchase_units[0].amount.value;

    const newOrder = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price, // سعر المنتج عند الشراء
        selectedOptions: item.selectedOptions,
      })),
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod: "PayPal",
      paymentResult: {
        id: captureResult.result.id,
        status: captureResult.result.status,
        email_address: captureResult.result.payer.email_address,
      },
      isPaid: true,
      paidAt: new Date(),
    });

    // 4. تفريغ سلة الشراء بالكامل (Clear Cart)
    cart.items = [];
    await cart.save();

    // 5. إرجاع النتيجة للفرونت إند
    res.status(201).json({
      success: true,
      message: "Payment captured, order created, and cart cleared successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};