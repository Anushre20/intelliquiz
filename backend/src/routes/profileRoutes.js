const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/profileController");

router.get("/:userId", getUserProfile);

module.exports = router;
