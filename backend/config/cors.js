const corsOptions = {
    origin: "http://localhost:5173", // Vite's default dev server port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  module.exports = corsOptions;