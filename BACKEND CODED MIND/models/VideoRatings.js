const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per user per video
ratingSchema.index({ video: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);