const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    summary: String,
    bugs: [
      {
        title: String,
        description: String,
        severity: { type: String, enum: ["High", "Medium", "Low"] },
      },
    ],
    security: [
      {
        title: String,
        description: String,
        severity: { type: String, enum: ["High", "Medium", "Low"] },
      },
    ],
    complexity: {
      time: String,
      space: String,
      explanation: String,
    },
    codeQuality: {
      score: Number,
      comment: String,
    },
    suggestions: [String],
  },
  { timestamps: true } // adds createdAt/updatedAt automatically — useful for History later
);

module.exports = mongoose.model("Review", reviewSchema);