const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const userController = require('../controllers/user.controller'); // Adjust path as needed
// Endpoint لجلب بيانات البروفايل للمستخدم الحالي
// router.get("/profile", protect, async (req, res, next) => {
//   try {
//     res.status(200).json({
//       success: true,
//       data: req.user, // تم تجهيزه وتوفيره بواسطة الـ protect middleware
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
