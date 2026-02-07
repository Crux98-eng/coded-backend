
const Lesson = require('../models/Lesson');
const { cloudinary } = require('../services/cloudinary');
const streamifier = require('streamifier');
const BASE_URL = "https://coded-backend.onrender.com";
exports.createLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required (field: file)' });
    }

    // 1️⃣ Upload + generate HLS at upload-time
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'lessons',
          chunk_size: 6_000_000,

          //  PRE-GENERATE STREAMING
          eager: [
            {
              format: 'm3u8',
              transformation: [
                { streaming_profile: 'hd' }
              ]
            }
          ],
          eager_async: true,

          // optional but HIGHLY recommended
          eager_notification_url: `${BASE_URL}/lessons/cloudinary-notify`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // 2️⃣ Extract HLS URL safely
    const hlsUrl =
      uploadResult.eager?.[0]?.secure_url ||
      null;

    // 3️⃣ Save lesson in "processing" state
    const lesson = await Lesson.create({
      courseId: req.body.courseId,
      moduleId: req.body.moduleId,
      title: req.body.title,
      description: req.body.description || '',
      videoUrl: hlsUrl,               
      videoPublicId: uploadResult.public_id,
      duration: (uploadResult.duration)/60 || 0,
      order: Number(req.body.order) || 0,
      isPreview: req.body.isPreview === 'true' || req.body.isPreview === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
      status: 'processing'            
    });

    return res.status(201).json({
      message: 'Lesson uploaded, video processing started',
      lesson
    });

  } catch (err) {
    console.error('Lesson upload error:', err);
    return res.status(500).json({ error: 'Failed to create lesson' });
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
exports.cloudinaryNotify = async (req, res) => {
  try {
    const { public_id } = req.body;

    await Lesson.findOneAndUpdate(
      { videoPublicId: public_id },
      { status: 'ready' }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error('Cloudinary notify error:', err);
    res.sendStatus(500);
  }
};
