const Announcement = require('../models/announcement.model');

// 1. جلب كافة الإعلانات (لوحة التحكم)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: announcements });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({active:true}).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: announcements });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};


// 2. إضافة إعلان جديد
exports.createAnnouncement = async (req, res) => {
  try {
    const { text, link, active, startDate, endDate } = req.body;
console.log({ text, link, active, startDate, endDate})
    const newAnnouncement = await Announcement.create({
      text,
      link,
      active,
      startDate,
      endDate
    });

    res.status(201).json({
      status: 'success',
      data: newAnnouncement,
      message: 'announcement added successfully'
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 3. تعديل إعلان
exports.updateAnnouncement = async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ status: 'fail', message: 'الإعلان غير موجود' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedAnnouncement,
      message: 'تم تحديث الإعلان بنجاح'
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 4. حذف إعلان
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ status: 'fail', message: 'الإعلان غير موجود' });
    }

    res.status(200).json({
      status: 'success',
      message: 'تم حذف الإعلان بنجاح'
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};