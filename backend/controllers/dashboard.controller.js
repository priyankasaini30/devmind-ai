const asyncHandler = require("../middleware/asyncHandler");
const { getDashboardStats } = require("../services/review.service");
const { getInterviewStats } = require("../services/interview.service");
const getStats = asyncHandler(async (req, res) => {
  const [reviewStats, interviewStats] = await Promise.all([
    getDashboardStats(req.user.id),
    getInterviewStats(req.user.id),
]);
res.status(200).json({
  ...reviewStats,
  ...interviewStats,
});
});


module.exports = {
  getStats,
};