const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getAdminDashboard } = require("../controllers/adminDashboard");

router.route("/").get(protect, getAdminDashboard);

module.exports = router;

