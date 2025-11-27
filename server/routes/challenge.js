const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getChallenges,
  getChallenge,
  joinChallenge,
  completeChallenge,
  createChallenge,
} = require("../controllers/challenge");

router.route("/").get(protect, getChallenges).post(protect, createChallenge);
router.route("/:id").get(protect, getChallenge);
router.route("/:id/join").post(protect, joinChallenge);
router.route("/:id/complete").post(protect, completeChallenge);

module.exports = router;

