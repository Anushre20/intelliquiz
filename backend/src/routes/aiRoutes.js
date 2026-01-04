const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { generateAIQuiz } = require("../controllers/aiController");

router.post(
  "/generate",
  upload.single("file"), // 👈 MUST be "file"
  generateAIQuiz
);

module.exports = router;
