const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");

// CREATE QUIZ
router.post("/create", quizController.createQuiz);

// GET QUESTIONS
router.get("/:quizId/questions", quizController.getQuizQuestions);

// SUBMIT QUIZ
router.post("/:quizId/submit", quizController.submitAttempt);

// ANALYTICS
router.get("/:quizId/analytics", quizController.getQuizAnalytics);

module.exports = router;
