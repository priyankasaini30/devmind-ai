const AppError = require("../utils/AppError");

const ALLOWED_LANGUAGES = ["java", "javascript", "python", "c", "cpp", "c++"];
const MAX_CODE_LENGTH = 20000; // characters — keeps Gemini calls fast and bounded cost

const validateReview = (req, res, next) => {
  const { code, language } = req.body;

  if (!code || typeof code !== "string" || !code.trim()) {
    return next(new AppError("Code is required and must be a non-empty string", 400));
  }

  if (!language || typeof language !== "string") {
    return next(new AppError("Language is required", 400));
  }

  if (!ALLOWED_LANGUAGES.includes(language.toLowerCase())) {
    return next(
      new AppError(
        `Unsupported language "${language}". Allowed: ${ALLOWED_LANGUAGES.join(", ")}`,
        400
      )
    );
  }

  if (code.length > MAX_CODE_LENGTH) {
    return next(
      new AppError(`Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`, 400)
    );
  }

  next();
};

module.exports = validateReview;