const ErrorResponse = require("../utils/errorResponse");
const ProofSubmission = require("../models/ProofSubmission");
const Hobby = require("../models/Hobby");
const User = require("../models/User");
const Reward = require("../models/Reward");

// @desc    Submit proof
exports.submitProof = async (req, res, next) => {
  try {
    const { hobbyId, submission, submissionType } = req.body;

    const hobby = await Hobby.findById(hobbyId);

    if (!hobby) {
      return next(new ErrorResponse("Hobby not found", 404));
    }

    if (hobby.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("Not authorized", 401));
    }

    const proofSubmission = await ProofSubmission.create({
      user: req.user._id,
      hobby: hobbyId,
      submission,
      submissionType: submissionType || "text",
    });

    res.status(201).json({
      success: true,
      data: proofSubmission,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all proofs for user
exports.getProofs = async (req, res, next) => {
  try {
    const proofs = await ProofSubmission.find({ user: req.user._id })
      .populate("hobby", "hobbyName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proofs.length,
      data: proofs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify proof (Admin only)
exports.verifyProof = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorResponse("Not authorized as admin", 401));
    }

    const { pointsAwarded } = req.body;
    const proof = await ProofSubmission.findById(req.params.id);

    if (!proof) {
      return next(new ErrorResponse("Proof not found", 404));
    }

    if (proof.verified) {
      return next(new ErrorResponse("Proof already verified", 400));
    }

    proof.verified = true;
    proof.verifiedBy = req.user._id;
    proof.verifiedAt = Date.now();
    proof.pointsAwarded = pointsAwarded || 10;

    await proof.save();

    // Update user points
    const user = await User.findById(proof.user);
    user.points += proof.pointsAwarded;
    await user.save();

    // Update hobby points
    const hobby = await Hobby.findById(proof.hobby);
    hobby.pointsEarned += proof.pointsAwarded;
    await hobby.save();

    // Check for milestone rewards
    await checkMilestoneRewards(proof.user, user.points);

    res.status(200).json({
      success: true,
      data: proof,
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to check and award milestone rewards
const checkMilestoneRewards = async (userId, totalPoints) => {
  const milestones = [50, 100, 250, 500, 1000, 2500, 5000];
  
  for (const milestone of milestones) {
    if (totalPoints >= milestone) {
      const existingReward = await Reward.findOne({
        user: userId,
        badgeName: `${milestone} Points Milestone`,
      });

      if (!existingReward) {
        await Reward.create({
          user: userId,
          badgeName: `${milestone} Points Milestone`,
          badgeType: "milestone",
          pointsEarned: milestone,
          pointsRequired: milestone,
          unlocked: true,
          unlockedAt: Date.now(),
        });
      }
    }
  }
};

