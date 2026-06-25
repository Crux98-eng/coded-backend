const Lesson = require("../models/Lesson");
const { uploadBuffer, deleteFile } = require("../services/imagekit");
const { Autjenticate, authenticate } = require("../middleware/auth");
const { checkBlocked } = require("../middleware/checkBlocked");

exports.createLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Video file is required (field: file)" });
    }

    // Upload video directly (NO transformation)
    const uploadResult = await uploadBuffer(
      req.file.buffer,
      req.file.originalname,
      {
        folder: "lessons",
        tags: ["lesson-video"],
        useUniqueFileName: true,
        responseFields: ["fileId", "url", "duration"],
      },
    );

    const durationSeconds =
      uploadResult?.duration ||
      uploadResult?.metadata?.duration ||
      Number(req.body.duration) ||
      0;

    const lesson = await Lesson.create({
      courseId: req.body.courseId,
      moduleId: req.body.moduleId,
      title: req.body.title,
      description: req.body.description || "",
      videoUrl: uploadResult.url,
      videoPublicId: uploadResult.fileId,
      duration: durationSeconds,
      order: Number(req.body.order) || 0,
      isPreview: req.body.isPreview === "true" || req.body.isPreview === true,
      isPublished:
        req.body.isPublished === "true" || req.body.isPublished === true,
      status: "ready", // no conversion needed
    });

    return res.status(201).json({
      message: "Lesson uploaded successfully (MP4 direct)",
      lesson,
    });
  } catch (err) {
    console.error("Lesson upload error:", err);

    const status = err?.response?.statusCode;

    return res
      .status(status && status >= 400 && status < 600 ? status : 500)
      .json({
        error: err?.message || "Failed to create lesson",
      });
  }
};

exports.listLessons = async (req, res) => {
    try {
      const filter = {};
      
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
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    return res.status(200).json(lesson);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const allowed = (({
      title,
      description,
      duration,
      order,
      isPreview,
      isPublished,
    }) => ({ title, description, duration, order, isPreview, isPublished }))(
      req.body,
    );
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true,
    });
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    return res.status(200).json(lesson);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    // attempt to remove video from ImageKit if file id present
    try {
      if (lesson.videoPublicId) await deleteFile(lesson.videoPublicId);
    } catch (e) {
      console.error("ImageKit delete error (lesson):", e.message || e);
    }
    return res.status(200).json({ message: "Lesson deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.cloudinaryNotify = async (req, res) => {
  try {
    const { public_id, file_id, fileId } = req.body;
    const videoId = public_id || file_id || fileId;
    if (!videoId) return res.sendStatus(400);

    await Lesson.findOneAndUpdate(
      { videoPublicId: videoId },
      { status: "ready" },
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Cloudinary notify error:", err);
    res.sendStatus(500);
  }
};
