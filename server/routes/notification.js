const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendInactiveReminders,
  sendPendingTaskReminder,
} = require("../controllers/notification");

router.route("/inactive").post(protect, sendInactiveReminders);
router.route("/pending").post(protect, sendPendingTaskReminder);

module.exports = router;

