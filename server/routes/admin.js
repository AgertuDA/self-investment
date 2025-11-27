const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createAdmin, getAdmins } = require("../controllers/admin");

// Create admin - no auth required if no admin exists, otherwise requires admin
router.route("/create").post(createAdmin);

// Get all admins - requires admin authentication
router.route("/list").get(protect, getAdmins);

module.exports = router;

