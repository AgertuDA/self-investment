const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  badgeName: {
    type: String,
    required: true,
  },
  badgeType: {
    type: String,
    enum: ["achievement", "milestone", "challenge", "streak"],
    default: "achievement",
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  pointsRequired: {
    type: Number,
    default: 0,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
  unlockedAt: Date,
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Reward", RewardSchema);

