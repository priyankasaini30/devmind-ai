const express = require("express");

const { listReviews, getReview } = require("../controllers/history.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/reviews", protect, listReviews);
router.get("/reviews/:id", protect, getReview);

module.exports = router;