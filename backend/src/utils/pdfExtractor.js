const pdfParse = require("pdf-parse");

console.log("pdf-parse typeof:", typeof pdfParse);
console.log("pdf-parse value:", pdfParse);
async function extractTextFromPDF(buffer) {
  try {
    if (!buffer) {
      throw new Error("No PDF buffer provided");
    }

    const data = await pdfParse(buffer);

    if (!data || !data.text) {
      throw new Error("No text extracted from PDF");
    }

    return data.text;
  } catch (error) {
    console.error("PDF parse error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
}

module.exports = { extractTextFromPDF };
