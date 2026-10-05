const express = require("express");
const router = express.Router();

// استدعاء الدوال من الـ Controller الخاص بك
const {
  createPaypalOrder,
  capturePaypalOrder,
  getAllOrders,
} = require("../controllers/payment.controller");

router.post("/paypal/create-order", createPaypalOrder);

router.post("/paypal/capture-order", capturePaypalOrder);

router.get("/orders", getAllOrders);

module.exports = router;
