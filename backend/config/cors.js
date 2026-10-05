const corsOptions = {
    origin: ["http://localhost:5173",
      "https://devmind-ai-five.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  module.exports = corsOptions;