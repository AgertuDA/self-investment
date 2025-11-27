const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getHobbies,
  createHobby,
  updateHobby,
  deleteHobby,
  completeHobby,
} = require("../controllers/hobby");

router.route("/").get(protect, getHobbies).post(protect, createHobby);
router.route("/:id").put(protect, updateHobby).delete(protect, deleteHobby);
router.route("/:id/complete").put(protect, completeHobby);

module.exports = router;

