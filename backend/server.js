require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await connectRedis(); // non-fatal if this fails — app still starts
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});