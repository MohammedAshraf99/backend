// const Cart = require("../models/cart.model");

// // جلب كافة المنتجات المفضلة لمستخدم معين مع كامل بياناتها
// router.get("/api/favorites/:userId", async (req, res) => {
//   try {
//     // استخدام populate لجلب بيانات المنتجات كاملة بدلاً من المعرفات فقط
//     const user = await User.findById(req.params.userId).populate("favorites");
//     if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

//     res.json(user.favorites);
//   } catch (error) {
//     res.status(500).json({ message: "حدث خطأ في السيرفر" });
//   }
// });
