const db = require("../db/connection");

const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id AS user_id,
        u.name,
        COUNT(a.id) AS quizzes_taken,
        SUM(a.score) AS total_score,
        SUM(a.total) AS total_questions,
        ROUND((SUM(a.score) / SUM(a.total)) * 100, 2) AS avg_score
      FROM users u
      JOIN attempts a ON a.user_id = u.id
      GROUP BY u.id
      ORDER BY avg_score DESC, total_score DESC
      LIMIT 10
    `);

    res.json({ leaderboard: rows });
  } catch (error) {
    console.error("Leaderboard error:", error.message);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};

module.exports = { getLeaderboard };
