const db = require("../db/connection");

const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        COUNT(*) AS totalAttempts,
        SUM(score) AS totalScore,
        SUM(total) AS totalQuestions,
        SUM(time_taken) AS totalTime
      FROM attempts
      WHERE user_id = ?
      `,
      [userId]
    );

    const data = rows[0];

    const accuracy = data.totalQuestions
      ? Math.round((data.totalScore / data.totalQuestions) * 100)
      : 0;

    res.json({
      totalAttempts: data.totalAttempts || 0,
      totalScore: data.totalScore || 0,
      totalQuestions: data.totalQuestions || 0,
      accuracy,
      totalTime: data.totalTime || 0,
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

module.exports = { getUserAnalytics };
