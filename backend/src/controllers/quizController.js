const db = require("../db/connection");

/* =======================
   CREATE QUIZ
======================= */
const createQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res
        .status(400)
        .json({ message: "Topic and difficulty are required" });
    }

    // 1️⃣ Create quiz
    const [quizResult] = await db.query(
      "INSERT INTO quizzes (topic, difficulty) VALUES (?, ?)",
      [topic, difficulty]
    );

    const quizId = quizResult.insertId;

    // 2️⃣ Insert dummy questions
    const questions = [
      {
        q: "What is the time complexity of binary search?",
        opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correct: 1,
      },
      {
        q: "Which data structure uses FIFO?",
        opts: ["Stack", "Queue", "Tree", "Graph"],
        correct: 1,
      },
      {
        q: "Which keyword is used to define a class in C++?",
        opts: ["struct", "class", "define", "object"],
        correct: 1,
      },
    ];

    for (const item of questions) {
      await db.query(
        `INSERT INTO questions 
        (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          quizId,
          item.q,
          item.opts[0],
          item.opts[1],
          item.opts[2],
          item.opts[3],
          item.correct,
        ]
      );
    }

    res.status(201).json({
      quizId,
      message: "Quiz created successfully",
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* =======================
   GET QUIZ QUESTIONS
   (Dummy – Step 9)
======================= */
const { getQuestionsByQuizId } = require("../models/questionModel");

const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const questions = await getQuestionsByQuizId(quizId);

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.json({
      quizId,
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};
/* =======================
   SUBMIT QUIZ ATTEMPT
   (Step 11 – DEBUGGED)
======================= */
const submitAttempt = async (req, res) => {
  try {
    const { userId, score, timeTaken } = req.body;
    const quizId = req.params.quizId;

    if (!userId || score === undefined || !quizId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Get total questions
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM questions WHERE quiz_id = ?",
      [quizId]
    );

    const total = rows[0].total;

    await db.query(
      `INSERT INTO attempts (user_id, quiz_id, score, total, time_taken)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, quizId, score, total, timeTaken]
    );

    res.json({ score, total });
  } catch (err) {
    console.error("Submit attempt error:", err);
    res.status(500).json({ message: "Failed to submit attempt" });
  }
};


/* =======================
   QUIZ ANALYTICS
======================= */
const getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;

    const [attempts] = await db.query(
      "SELECT score, time_taken FROM attempts WHERE quiz_id = ?",
      [quizId]
    );

    if (!attempts.length) {
      return res.status(200).json({
        averageScore: 0,
        totalAttempts: 0,
        attempts: [],
      });
    }

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = totalScore / attempts.length;

    res.status(200).json({
      averageScore,
      totalAttempts: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =======================
   EXPORT (ONLY ONCE ✅)
======================= */
module.exports = {
  createQuiz,
  getQuizQuestions,
  submitAttempt,
  getQuizAnalytics,
};
