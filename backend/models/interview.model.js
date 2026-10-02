const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String }, // filled in once the user responds
    feedback: { type: String }, // AI's evaluation of the answer
    score: { type: Number, min: 0, max: 10 }, // per-question score
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String, // e.g. "JavaScript", "Data Structures", or based on submitted code
      required: true,
    },
    code: {
      type: String, // optional: code the interview is based on, if any
    },
    questions: [qaSchema],
    maxQuestions: { type: Number, required: true },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    overallScore: { type: Number, min: 0, max: 10 },
    overallFeedback: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);