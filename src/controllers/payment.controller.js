const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../config/paypal");
const Order = require("../models/order.model"); // 💡 استيراد الموديل الجديد

// 1. إنشاء طلب الدفع
exports.createPaypalOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
        },
      ],
    });

    const order = await client().execute(request);
    res.status(201).json({ success: true, orderID: order.result.id });
  } catch (error) {
    next(error);
  }
};

// 2. تأكيد الدفع وحفظ العملية في قاعدة البيانات
exports.capturePaypalOrder = async (req, res, next) => {
  try {
    const { orderID, items } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);

    if (capture.result.status === "COMPLETED") {
      const payer = capture.result.payer;
      const purchaseUnit = capture.result.purchase_units[0];

      // 💡 حفظ العملية في قاعدة البيانات عبر الموديل
      const savedOrder = await Order.create({
        orderID: capture.result.id,
        amount: Number(purchaseUnit.payments.captures[0].amount.value),
        currency: purchaseUnit.payments.captures[0].amount.currency_code,
        customerInfo: {
          name: `${payer.name.given_name} ${payer.name.surname}`,
          email: payer.email_address,
          payerId: payer.payer_id,
        },
        status: capture.result.status,
        items: items || [], // قائمة المنتجات المشتراة
      });

      res.status(200).json({
        success: true,
        message: "تمت عملية الدفع وحفظ الطلب بنجاح",
        order: savedOrder,
      });
    } else {
      res.status(400).json({ success: false, message: "فشلت عملية الدفع" });
    }
  } catch (error) {
    next(error);
  }
};

// 3. دالة لجلب جميع الطلبات للوحة التحكم (البيانات التي سيتم عرضها)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // ترتيب من الأحدث للأقدم
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};