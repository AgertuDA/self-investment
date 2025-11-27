const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  submitQuestionnaire,
  getQuestionnaire,
} = require("../controllers/questionnaire");

router.route("/").get(protect, getQuestionnaire).post(protect, submitQuestionnaire);

module.exports = router;

