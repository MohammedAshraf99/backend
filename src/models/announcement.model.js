const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'نص الإعلان مطلوب'],
    trim: true,
  },
  link: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'تاريخ انتهاء الإعلان مطلوب'],
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);