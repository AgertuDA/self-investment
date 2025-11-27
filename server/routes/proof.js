const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  submitProof,
  getProofs,
  verifyProof,
} = require("../controllers/proof");

router.route("/").get(protect, getProofs).post(protect, submitProof);
router.route("/:id/verify").put(protect, verifyProof);

module.exports = router;

