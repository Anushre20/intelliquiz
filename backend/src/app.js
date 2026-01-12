require("dotenv").config();
const express = require("express");
const cors = require("cors");


const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(cors({
  origin: "https://intelliquiz-one.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
