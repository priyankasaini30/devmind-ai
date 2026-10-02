const express = require("express");

const { getStats } = require("../controllers/dashboard.controller");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard/stats", protect, getStats);

module.exports = router;