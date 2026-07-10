const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  videoPublicId: { type: String, required: true },
  storageType: { type: String, default: 'r2' },
  storageKey: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  fileName: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isPreview: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  status: { type: String, default: 'ready' },
  createdAt: { type: Date, default: Date.now },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingSum: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
