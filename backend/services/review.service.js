const Review = require("../models/review.model");

const getAllReviews = async ({userId, page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({userId})
      .sort({ createdAt: -1 }) // most recent first
      .skip(skip)
      .limit(limit)
      .select("language summary codeQuality.score createdAt"), // list view doesn't need full code/bugs
    Review.countDocuments({userId}),
  ]);

  return {
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getReviewById = async (id, userId ) => {
  return Review.findOne({_id: id, userId});
};
const getDashboardStats = async ({userId}) => {
    const totalReviews = await Review.countDocuments({userId});
  
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageScore: 0,
        totalBugs: 0,
        totalSecurityIssues: 0,
        languageBreakdown: [],
        recentReviews: [],
      };
    }
  
    const [scoreAgg] = await Review.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$codeQuality.score" },
          totalBugs: { $sum: { $size: { $ifNull: ["$bugs", []] } } },
          totalSecurityIssues: { $sum: { $size: { $ifNull: ["$security", []] } } },
        },
      },
    ]);
  
    const languageBreakdown = await Review.aggregate([
      { $match: { userId } },
      { $group: { _id: "$language", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  
    const recentReviews = await Review.find({userId})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("language summary codeQuality.score createdAt");
  
    return {
      totalReviews,
      averageScore: Math.round((scoreAgg?.averageScore || 0) * 10) / 10, // one decimal place
      totalBugs: scoreAgg?.totalBugs || 0,
      totalSecurityIssues: scoreAgg?.totalSecurityIssues || 0,
      languageBreakdown: languageBreakdown.map((l) => ({
        language: l._id,
        count: l.count,
      })),
      recentReviews,
    };
  };
  
  module.exports = {
    getAllReviews,
    getReviewById,
    getDashboardStats,
  };