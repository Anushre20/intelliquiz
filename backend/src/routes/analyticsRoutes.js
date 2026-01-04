const express = require("express");
const router = express.Router();
const { getUserAnalytics } = require("../controllers/analyticsController");

router.get("/:userId", getUserAnalytics);

module.exports = router;
