const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const { getAllReviews, getReviewById } = require("../services/review.service");

const listReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getAllReviews({ userId: req.user.id, page, limit });
  res.status(200).json(result);
});

const getReview = asyncHandler(async (req, res) => {
  const review = await getReviewById(req.params.id, req.user.id);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  res.status(200).json(review);
});

module.exports = {
  listReviews,
  getReview,
};