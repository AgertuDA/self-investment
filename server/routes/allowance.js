const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getAllowancePlan,
  updateAllowancePlan,
} = require("../controllers/allowance");

router.route("/").get(protect, getAllowancePlan).put(protect, updateAllowancePlan);

module.exports = router;

