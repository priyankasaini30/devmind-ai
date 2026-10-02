const express = require("express");

const { reviewCode } = require("../controllers/review.controller");
const validateReview = require("../middleware/validateReview");
const reviewLimiter = require("../middleware/rateLimiter");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/review", protect, reviewLimiter, validateReview, reviewCode);

module.exports = router;