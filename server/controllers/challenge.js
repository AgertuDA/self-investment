const ErrorResponse = require("../utils/errorResponse");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const Reward = require("../models/Reward");

// @desc    Get all challenges
exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      status: { $in: ["upcoming", "active"] },
    }).sort({ startDate: -1 });

    // Add participation status for current user
    const challengesWithStatus = challenges.map((challenge) => {
      const challengeObj = challenge.toObject();
      challengeObj.isParticipant = challenge.participants.some(
        (p) => p.toString() === req.user._id.toString()
      );
      challengeObj.isCompleted = challenge.completedBy.some(
        (c) => c.user.toString() === req.user._id.toString()
      );
      return challengeObj;
    });

    res.status(200).json({
      success: true,
      count: challengesWithStatus.length,
      data: challengesWithStatus,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single challenge
exports.getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return next(new ErrorResponse("Challenge not found", 404));
    }

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Join challenge
exports.joinChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return next(new ErrorResponse("Challenge not found", 404));
    }

    if (challenge.status !== "active" && challenge.status !== "upcoming") {
      return next(new ErrorResponse("Challenge is not available to join", 400));
    }

    // Check if user already joined
    if (challenge.participants.includes(req.user._id)) {
      return next(new ErrorResponse("Already joined this challenge", 400));
    }

    challenge.participants.push(req.user._id);
    await challenge.save();

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete challenge
exports.completeChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return next(new ErrorResponse("Challenge not found", 404));
    }

    if (!challenge.participants.includes(req.user._id)) {
      return next(new ErrorResponse("Not a participant in this challenge", 400));
    }

    // Check if already completed
    const alreadyCompleted = challenge.completedBy.some(
      (completion) => completion.user.toString() === req.user._id.toString()
    );

    if (alreadyCompleted) {
      return next(new ErrorResponse("Challenge already completed", 400));
    }

    // Add to completed list
    challenge.completedBy.push({
      user: req.user._id,
      completedAt: Date.now(),
    });

    await challenge.save();

    // Award points
    const user = await User.findById(req.user._id);
    user.points += challenge.rewardPoints;
    await user.save();

    // Create reward
    await Reward.create({
      user: req.user._id,
      badgeName: challenge.challengeName,
      badgeType: "challenge",
      pointsEarned: challenge.rewardPoints,
      pointsRequired: 0,
      unlocked: true,
      unlockedAt: Date.now(),
      challenge: challenge._id,
    });

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create challenge (Admin only)
exports.createChallenge = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorResponse("Not authorized as admin", 401));
    }

    const { challengeName, description, startDate, endDate, rewardPoints } = req.body;

    const challenge = await Challenge.create({
      challengeName,
      description,
      startDate,
      endDate,
      rewardPoints: rewardPoints || 50,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

