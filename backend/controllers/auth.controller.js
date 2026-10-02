const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const { registerUser, loginUser } = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const result = await registerUser({ name, email, password });
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const result = await loginUser({ email, password });
  res.status(200).json(result);
});

module.exports = {
  register,
  login,
};