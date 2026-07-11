const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Feature Request",
        "Bug Report",
        "Course Request",
        "General Feedback",
      ],
      default: "General Feedback",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
