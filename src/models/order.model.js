const mongoose = require("mongoose");

  const orderSchema = new mongoose.Schema(
    {
      orderID: { type: String, required: true, unique: true }, // رقم عملية PayPal
      amount: { type: Number, required: true },
      currency: { type: String, default: "GBP" },
      customerInfo: {
        name: String,
        email: String,
        payerId: String,
      },
      status: { type: String, default: "COMPLETED" },
      items: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
    },
    { timestamps: true }, // يضيف تلقائياً createdAt و updatedAt لتحديد تاريخ وساعة الشراء
  );

module.exports = mongoose.model("Order", orderSchema);


  //     orderID: { type: String, required: true, unique: true }, // رقم عملية PayPal
  //     amount: { type: Number, required: true },
  //     currency: { type: String, default: "GBP" },
  //     status: { type: String, default: "COMPLETED" },
  //     customerInfo:{type: orderSchema.Types.ObjectId, ref: "User", required: true} ,
  //     cartId:{type: orderSchema.Types.ObjectId, ref: "Cart", required: true} ,
  //   }, { timestamps: true }, // يضيف تلقائياً createdAt و updatedAt لتحديد تاريخ وساعة الشراء
  // );
