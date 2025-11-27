const mongoose = require("mongoose");

const AllowancePlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  planName: {
    type: String,
    default: "Personalized Allowance Plan",
  },
  weeklyBudget: {
    type: Number,
    required: true,
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  allocations: {
    essentials: {
      type: Number,
      default: 0,
    },
    hobbies: {
      type: Number,
      default: 0,
    },
    savings: {
      type: Number,
      default: 0,
    },
  },
  savingsGoal: {
    type: Number,
    default: 0,
  },
  categories: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model("AllowancePlan", AllowancePlanSchema);

