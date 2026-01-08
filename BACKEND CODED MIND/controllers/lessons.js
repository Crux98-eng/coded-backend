const Lesson = require('../models/Lesson');
const cloud = require('../services/cloudinary');

exports.createLesson = async (req, res) => {
  try {
    // Expect multipart/form-data with field 'file' (video) and other metadata in body
    if (!req.file) return res.status(400).json({ error: 'Video file is required (field: file)' });

    // Build data URI from buffer
    const mime = req.file.mimetype || 'video/mp4';
    const dataUri = `data:${mime};base64,${req.file.buffer.toString('base64')}`;

    // Upload video to Cloudinary (resource_type: video)
    const uploadResult = await cloud.uploadDataUri(dataUri, { resource_type: 'video' });
//the cloudinary will return some metadata then we combine withe the data from the body
//and create the payload to save to ouur mongodb
    const payload = {
      courseId: req.body.courseId,
      moduleId: req.body.moduleId,
      title: req.body.title,
      description: req.body.description || '',
      videoUrl: uploadResult.secure_url,
      videoPublicId: uploadResult.public_id,
      duration: uploadResult.duration || 0,
      order: req.body.order || 0,
      isPreview: req.body.isPreview === 'true' || req.body.isPreview === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    const lesson = await Lesson.create(payload);
    return res.status(201).json(lesson);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.moduleId) filter.moduleId = req.query.moduleId;
    const lessons = await Lesson.find(filter).lean();
    return res.status(200).json(lessons);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    return res.status(200).json(lesson);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const allowed = (({ title, description, duration, order, isPreview, isPublished }) => 
      ({ title, description, duration, order, isPreview, isPublished }))(req.body);
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    return res.status(200).json(lesson);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    // attempt to remove video from Cloudinary if public id present
    try {
      if (lesson.videoPublicId) await cloud.destroy(lesson.videoPublicId, { resource_type: 'video' });
    } catch (e) {
      console.error('Cloudinary delete error (lesson):', e.message || e);
    }
    return res.status(200).json({ message: 'Lesson deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
