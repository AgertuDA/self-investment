const mongoose = require("mongoose");

const HobbySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hobbyName: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly",
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "paused"],
    default: "in-progress",
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  lastCompleted: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Hobby", HobbySchema);

