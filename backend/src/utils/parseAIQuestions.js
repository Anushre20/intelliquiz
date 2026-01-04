function parseAIQuestions(aiText) {
  const lines = aiText
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const questions = [];
  let current = null;

  for (const line of lines) {
    // New question
    if (
      !line.startsWith("A)") &&
      !line.startsWith("B)") &&
      !line.startsWith("C)") &&
      !line.startsWith("D)") &&
      !line.toLowerCase().includes("correct")
    ) {
      if (current && current.options.length === 4) {
        questions.push(current);
      }

      current = {
        question: line,
        options: [],
        correct: null,
      };
    }

    // Options
    if (line.startsWith("A)")) current.options[0] = line.slice(2).trim();
    if (line.startsWith("B)")) current.options[1] = line.slice(2).trim();
    if (line.startsWith("C)")) current.options[2] = line.slice(2).trim();
    if (line.startsWith("D)")) current.options[3] = line.slice(2).trim();

    // Correct answer
    if (line.toLowerCase().includes("correct")) {
      const match = line.match(/([A-D])/i);
      if (match) {
        current.correct = match[1].toUpperCase().charCodeAt(0) - 65;
      }
    }
  }

  // Push last question
  if (current && current.options.length === 4 && current.correct !== null) {
    questions.push(current);
  }

  return questions;
}

module.exports = { parseAIQuestions };
