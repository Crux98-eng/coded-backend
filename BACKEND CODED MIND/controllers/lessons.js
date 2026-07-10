const Lesson = require("../models/Lesson");
const User = require("../models/User");
const Rating = require("../models/VideoRatings");
const { deleteFile } = require("../services/imagekit");
const { authenticate } = require("../middleware/auth");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const crypto = require("crypto");
const r2 = require("../config/R2");

const uploadLessonMediaToR2 = async (file) => {
  if (!file) throw new Error("Video file is required");

  const extension = file.originalname.includes(".")
    ? file.originalname.slice(file.originalname.lastIndexOf("."))
    : "";
  const fileName = `${crypto.randomUUID()}${extension}`;
  const key = `lessons/${fileName}`;
  const publicBaseUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2.send(command);

  return {
    key,
    fileName,
    url: `${publicBaseUrl}/${key}`,
    mimeType: file.mimetype,
    size: file.size,
  };
};

const buildLessonPayload = (req, uploadMeta) => ({
  courseId: req.body.courseId,
  moduleId: req.body.moduleId,
  title: req.body.title || uploadMeta.fileName,
  description: req.body.description || "",
  videoUrl: uploadMeta.url,
  videoPublicId: uploadMeta.key,
  duration: Number(req.body.duration) || 0,
  order: Number(req.body.order) || 0,
  isPreview: req.body.isPreview === "true" || req.body.isPreview === true,
  isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
  status: "ready",
  storageType: "r2",
  storageKey: uploadMeta.key,
  mimeType: uploadMeta.mimeType,
  fileSize: uploadMeta.size,
  fileName: uploadMeta.fileName,
});

exports.createLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Video file is required (field: file)" });
    }

    const uploadMeta = await uploadLessonMediaToR2(req.file);
    const lesson = await Lesson.create(buildLessonPayload(req, uploadMeta));

    return res.status(201).json({
      message: "Lesson uploaded successfully to Cloudflare R2",
      lesson,
    });
  } catch (err) {
    console.error("Lesson upload error:", err);

    return res.status(500).json({
      error: err?.message || "Failed to create lesson",
    });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Video file is required (field: file)" });
    }

    const uploadMeta = await uploadLessonMediaToR2(req.file);
    const lesson = await Lesson.create(buildLessonPayload(req, uploadMeta));

    return res.status(201).json({
      message: "Media uploaded successfully",
      lesson,
      upload: {
        key: uploadMeta.key,
        url: uploadMeta.url,
      },
    });
  } catch (error) {
    console.error("Lesson media upload error:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error?.message || "Unknown error",
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

    try {
      if (lesson.storageKey) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: lesson.storageKey,
        });
        await r2.send(deleteCommand);
      } else if (lesson.videoPublicId) {
        await deleteFile(lesson.videoPublicId);
      }
    } catch (e) {
      console.error("Media delete error (lesson):", e.message || e);
    }

    return res.status(200).json({ message: "Lesson deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.rateLesson = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const lessonId = req.params.id;
    const ratingValue = Number(req.body.rating);

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRating = await Rating.findOne({
      video: lesson._id,
      user: user._id,
    });

    if (existingRating) {
      if (existingRating.rating === ratingValue) {
        return res.status(200).json({
          message: "Rating already set",
          lesson,
        });
      }

      const difference = ratingValue - existingRating.rating;
      lesson.ratingSum = Number(lesson.ratingSum || 0) + difference;
      lesson.averageRating =
        lesson.totalRatings > 0 ? lesson.ratingSum / lesson.totalRatings : 0;
      existingRating.rating = ratingValue;

      await Promise.all([existingRating.save(), lesson.save()]);

      return res.status(200).json({
        message: "Rating updated successfully",
        lesson,
      });
    }

    lesson.ratingSum = Number(lesson.ratingSum || 0) + ratingValue;
    lesson.totalRatings = Number(lesson.totalRatings || 0) + 1;
    lesson.averageRating =
      lesson.totalRatings > 0 ? lesson.ratingSum / lesson.totalRatings : 0;

    const newRating = await Rating.create({
      video: lesson._id,
      user: user._id,
      rating: ratingValue,
    });

    await lesson.save();

    return res.status(201).json({
      message: "Rating submitted successfully",
      lesson,
      rating: newRating,
    });
  } catch (err) {
    console.error("Lesson rating error:", err);
    return res.status(500).json({ error: err.message || "Failed to rate lesson" });
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
