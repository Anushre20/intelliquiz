const Groq = require("groq-sdk");

// 🔥 IMPORTANT FIX
const pdfParse = require("pdf-parse");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   EXTRACT TEXT FROM PDF
========================= */
async function extractTextFromPDF(file) {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid PDF file");
    }

    const data = await pdfParse(file.buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parse error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
}

/* =========================
   GENERATE QUESTIONS (AI)
========================= */
async function generateQuestions({ text, difficulty, numberOfQuestions }) {
  try {
    const prompt = `
Generate ${numberOfQuestions} ${difficulty} multiple-choice questions
from the following text.

Text:
${text}

Rules:
- Each question must have 4 options (A, B, C, D)
- Clearly mention the correct option
- Keep questions concise
- Output in plain text (no markdown)
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates exam-quality multiple choice questions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    return content;
  } catch (error) {
    console.error("Groq AI error:", error.message);
    throw error;
  }
}

module.exports = {
  generateQuestions,
  extractTextFromPDF,
};
