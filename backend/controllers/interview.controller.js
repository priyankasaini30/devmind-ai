const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const {
  startInterview,
  submitAnswer,
  getInterviewById,
  getAllInterviews,
} = require("../services/interview.service");

const start = asyncHandler(async (req, res) => {
  const { topic, code } = req.body;

  if (!topic) {
    throw new AppError("Topic is required to start an interview", 400);
  }

  const interview = await startInterview({ userId: req.user.id, topic, code });
  res.status(201).json(interview);
});

const answer = asyncHandler(async (req, res) => {
  const { answer: userAnswer } = req.body;
  const { id } = req.params;

  if (!userAnswer || !userAnswer.trim()) {
    throw new AppError("Answer is required", 400);
  }

  const interview = await submitAnswer({
    interviewId: id,
    userId: req.user.id,
    answer: userAnswer,
  });

  res.status(200).json(interview);
});

const getOne = asyncHandler(async (req, res) => {
  const interview = await getInterviewById(req.params.id, req.user.id);

  if (!interview) {
    throw new AppError("Interview session not found", 404);
  }

  res.status(200).json(interview);
});

const getAll = asyncHandler(async (req, res) => {
  const interviews = await getAllInterviews(req.user.id);
  res.status(200).json(interviews);
});

module.exports = {
  start,
  answer,
  getOne,
  getAll,
};