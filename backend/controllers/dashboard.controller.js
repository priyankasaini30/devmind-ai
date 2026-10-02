const asyncHandler = require("../middleware/asyncHandler");
const { getDashboardStats } = require("../services/review.service");

const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats({userId: req.user.id});
  res.status(200).json(stats);
});

module.exports = {
  getStats,
};