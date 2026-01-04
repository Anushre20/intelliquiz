const db = require("../db/connection");

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get user info
    const [[user]] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Get quiz attempts
    const [attempts] = await db.query(
      `
      SELECT 
        quiz_id,
        score,
        total,
        time_taken,
        created_at
      FROM attempts
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      user,
      attempts,
    });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

module.exports = { getUserProfile };
