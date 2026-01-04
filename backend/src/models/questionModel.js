const db = require("../db/connection");

/* =======================
   SAVE QUESTIONS (BATCH)
======================= */
async function saveQuestions(quizId, questions) {
  if (!quizId) {
    throw new Error("quizId is required to save questions");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("No questions provided to save");
  }

  // ✅ Validate & normalize AI output
  const values = questions.map((q, index) => {
    if (
      !q.question ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correct !== "number"
    ) {
      throw new Error(`Invalid question format at index ${index}`);
    }

    return [
      quizId,
      q.question.trim(),
      q.options[0],
      q.options[1],
      q.options[2],
      q.options[3],
      q.correct,
    ];
  });

  const sql = `
    INSERT INTO questions
    (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
    VALUES ?
  `;

  await db.query(sql, [values]);
}

/* =======================
   GET QUESTIONS BY QUIZ
======================= */
async function getQuestionsByQuizId(quizId) {
  if (!quizId) {
    throw new Error("quizId is required");
  }

  const [rows] = await db.query(
    `
    SELECT 
      id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option
    FROM questions
    WHERE quiz_id = ?
    ORDER BY id ASC
    `,
    [quizId]
  );

  return rows.map((q) => ({
    id: q.id,
    question: q.question,
    options: [
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
    ],
    correct: q.correct_option,
  }));
}

module.exports = {
  saveQuestions,
  getQuestionsByQuizId,
};
