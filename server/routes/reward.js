const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getRewards,
  getUnlockedRewards,
} = require("../controllers/reward");

router.route("/").get(protect, getRewards);
router.route("/unlocked").get(protect, getUnlockedRewards);

module.exports = router;

