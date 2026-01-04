const { generateQuestions } = require("../services/aiService");
const { parseAIQuestions } = require("../utils/parseAIQuestions");
const { saveQuestions } = require("../models/questionModel");
const { extractTextFromPDF } = require("../utils/pdfExtractor");

/*
  POST /api/ai/generate
  Expects:
  - quizId (number)
  - difficulty (string)
  - numberOfQuestions (number)
  - text OR file (pdf)
*/
const generateAIQuiz = async (req, res) => {
  try {
    let { quizId, text, difficulty, numberOfQuestions } = req.body;

    // 🔒 Convert FormData strings → numbers
    quizId = Number(quizId);
    numberOfQuestions = Number(numberOfQuestions);

    // 1️⃣ Extract text from PDF if uploaded
    if (req.file) {
      text = await extractTextFromPDF(req.file.buffer);
    }

    // 2️⃣ Validation
    if (!quizId || !text || !difficulty || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing input data" });
    }

    // 3️⃣ Generate AI raw text
    const aiText = await generateQuestions({
      text,
      difficulty,
      numberOfQuestions,
    });

    // 4️⃣ Parse AI output → MCQs
    const parsedQuestions = parseAIQuestions(aiText);

    if (!parsedQuestions.length) {
      return res.status(400).json({ message: "No questions generated" });
    }

    // 🧪 TEMP DEBUG (KEEP FOR NOW)
    console.log("Saving questions for quiz:", quizId);
    console.log(parsedQuestions);

    // 5️⃣ Save questions to DB
    await saveQuestions(quizId, parsedQuestions);

    // 6️⃣ Respond
    res.json({
      message: "AI quiz generated & saved",
      quizId,
      totalQuestions: parsedQuestions.length,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({
      message: "AI generation failed",
      error: error.message,
    });
  }
};

module.exports = { generateAIQuiz };
