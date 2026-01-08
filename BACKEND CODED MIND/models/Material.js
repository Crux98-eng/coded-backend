const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'doc', 'link'], required: true },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
