const express = require("express");
const { start, answer, getOne, getAll } = require("../controllers/interview.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/interview/start", protect, start);
router.post("/interview/:id/answer", protect, answer);
router.get("/interview/:id", protect, getOne);
router.get("/interview", protect, getAll);

module.exports = router;