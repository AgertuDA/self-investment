const mongoose = require("mongoose");

const ProofSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hobby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hobby",
    required: true,
  },
  submission: {
    type: String,
    required: true,
  },
  submissionType: {
    type: String,
    enum: ["image", "text", "link"],
    default: "text",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verifiedAt: Date,
  pointsAwarded: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ProofSubmission", ProofSubmissionSchema);

