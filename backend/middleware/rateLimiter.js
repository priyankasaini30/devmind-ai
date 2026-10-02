const rateLimit = require("express-rate-limit");

// Gemini free tier allows 5 requests/minute for gemini-2.5-flash.
// We cap slightly under that to leave headroom.
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4,
  message: {
    success: false,
    message: "Too many review requests. Please wait a minute and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = reviewLimiter;