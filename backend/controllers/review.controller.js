const { reviewCodeWithGemini } = require("../services/ai.services");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const Review = require("../models/review.model");

const reviewCode = asyncHandler(async (req, res) => {
  const { code, language } = req.body;

  let review;
  try {
    review = await reviewCodeWithGemini(code, language);
  } catch (error) {
    console.error("Gemini API error:", error.message);

    const isQuotaError =
      error.status === 429 ||
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.message?.includes("429");

    if (isQuotaError) {
      throw new AppError(
        "AI review quota reached for this minute. Please wait a moment and try again.",
        429
      );
    }

    throw new AppError("AI review service is currently unavailable. Please try again.", 502);
  }

  // Save to DB — don't let a save failure break the response the user is waiting on
  try {
    await Review.create({userId: req.user.id, code, language, ...review  });
  } catch (saveError) {
    console.error("Failed to save review to DB:", saveError.message);
  }

  res.status(200).json(review);
});

module.exports = {
  reviewCode,
};