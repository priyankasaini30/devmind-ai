const { createClient } = require("redis");

let redisClient = null;
let isRedisAvailable = false;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
      isRedisAvailable = false;
    });

    await redisClient.connect();
    isRedisAvailable = true;
    console.log("Redis connected");
  } catch (error) {
    // Redis is a performance optimization, not a hard dependency —
    // the app must still work without it.
    console.error("Redis connection failed, caching disabled:", error.message);
    isRedisAvailable = false;
  }
};

const getRedisClient = () => (isRedisAvailable ? redisClient : null);

module.exports = { connectRedis, getRedisClient };