const ErrorResponse = require("../utils/errorResponse");
const Reward = require("../models/Reward");

// @desc    Get all rewards for user
exports.getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ user: req.user._id })
      .populate("challenge", "challengeName")
      .sort({ unlockedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unlocked rewards
exports.getUnlockedRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({
      user: req.user._id,
      unlocked: true,
    })
      .populate("challenge", "challengeName")
      .sort({ unlockedAt: -1 });

    res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards,
    });
  } catch (err) {
    next(err);
  }
};

