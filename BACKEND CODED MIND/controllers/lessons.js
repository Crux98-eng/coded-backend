const Lesson = require('../models/Lesson');
const { cloudinary } = require('../services/cloudinary');

const streamifier = require('streamifier');


exports.createLesson = async (req, res) => {
  try {
    //  Validate file
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required (field: file)' });
    }

    //  Upload video via stream (safe for large files)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    const newUrl = cloudinary.url(uploadResult.public_id, {
  resource_type: 'video',
  format: 'm3u8',
  streaming_profile: 'hd',
 secure: true
}



);


    //  Build payload
    const payload = {
      courseId: req.body.courseId,
      moduleId: req.body.moduleId,
      title: req.body.title,
      description: req.body.description || '',
      videoUrl: newUrl,
      videoPublicId: uploadResult.public_id,
      duration: uploadResult.duration || 0,
      order: Number(req.body.order) || 0,
      isPreview: req.body.isPreview === 'true' || req.body.isPreview === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    //  Save to MongoDB
    const lesson = await Lesson.create(payload);

    return res.status(201).json(lesson);

  } catch (err) {
   console.log('Error uploading lesson:', err);
    return res.status(500).json({ error: err.message || 'Failed to create lesson' });
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
