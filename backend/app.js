const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const corsOptions = require("./config/cors");
const reviewRoutes = require("./routes/review.routes");
const historyRoutes = require("./routes/history.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const errorHandler = require("./middleware/errorHandler");
const noteRoutes=require("./routes/note.routes");
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api",noteRoutes);

app.use("/api", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api", historyRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", interviewRoutes);
app.use(errorHandler);

module.exports = app;