const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.conroller');

// مسار العروض النشطة (للمتجر / الفرونت إند)
router.get('/active', announcementController.getActiveAnnouncements);

// مسارات لوحة التحكم (Admin)
router.route('/')
  .get(announcementController.getAllAnnouncements)  // جلب الكل
  .post(announcementController.createAnnouncement);  // إضافة إعلان

router.route('/:id')
  .put(announcementController.updateAnnouncement)   // تعديل إعلان
  .delete(announcementController.deleteAnnouncement); // حذف إعلان

module.exports = router;