const mongoose = require("mongoose");

const QuestionnaireSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  interests: [String],
  spendingHabits: {
    type: String,
    enum: ["low", "moderate", "high"],
  },
  spendingPriority: {
    type: String,
    enum: ["essentials", "hobbies", "savings", "balanced"],
  },
  monthlyAllowance: {
    type: Number,
    required: true,
  },
  hobbies: [String],
  goals: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Questionnaire", QuestionnaireSchema);

