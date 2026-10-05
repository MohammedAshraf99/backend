const Order = require("../models/order.model"); // 💡 استيراد الموديل الجديد
const { client, paypal } = require("../config/paypall");
// const { paypa } = require("../config/paypal");

// 1. Create payment order

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
            currency_code: "GBP",
            value:amount,
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

// 2. Confirm payment and save transaction to database
exports.capturePaypalOrder = async (req, res, next) => {
  try {
    const { orderID, items } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);
    console.log(capture.result.status === "COMPLETED");

    if (capture.result.status === "COMPLETED") {
      const payer = capture.result.payer;
      const purchaseUnit = capture.result.purchase_units[0];

      // 💡 Save transaction to database via model
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
        items: items || [], // List of purchased products
      });

      res.status(200).json({
        success: true,
        message: "Payment processed and order saved successfully",
        order: savedOrder,
      });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    next(error);
  }
};

// 3. Function to fetch all orders for the dashboard (data to be displayed)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort from newest to oldest
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};