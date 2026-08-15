const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// 1. Protect Middleware - حماية المسارات للـ Logged-in Users فقط
exports.protect = async (req, res, next) => {
  try {
    let token;

    // أ) التحقق من وجود الـ Token في الـ Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // لو مفيش Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route, token missing",
      });
    }

    // ب) التحقق من صحة الـ Token (Verify Token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ج) إيجاد المستخدم في الداتا بيز والتأكد إنه لسه موجود (بدون جلب الباسورد)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists",
      });
    }

    // د) إرفاق المستخدم الموثّق بـ req.user ليتوفر في باقي الـ Endpoints
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed or expired",
    });
  }
};

// 2. Authorize Roles - تحديد الصلاحيات (مثل الأدمن فقط)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
