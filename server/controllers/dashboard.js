const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const AllowancePlan = require("../models/AllowancePlan");
const Hobby = require("../models/Hobby");
const Reward = require("../models/Reward");
const Challenge = require("../models/Challenge");
const ProofSubmission = require("../models/ProofSubmission");

// @desc    Get dashboard data
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId);

    // Get allowance plan
    const allowancePlan = await AllowancePlan.findOne({ user: userId });

    // Get hobbies
    const hobbies = await Hobby.find({ user: userId });

    // Get rewards
    const rewards = await Reward.find({ user: userId, unlocked: true });

    // Get active challenges
    const activeChallenges = await Challenge.find({
      status: "active",
      participants: userId,
    });

    // Get recent proofs
    const recentProofs = await ProofSubmission.find({ user: userId })
      .populate("hobby", "hobbyName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    
    let streakDays = user.streakDays || 0;
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Continued streak
        streakDays = user.streakDays + 1;
      } else if (daysDiff > 1) {
        // Streak broken
        streakDays = 0;
      }
      // If daysDiff === 0, same day, keep current streak
    }

    // Update last activity and streak
    user.lastActivityDate = Date.now();
    user.streakDays = streakDays;
    await user.save();

    // Check for streak rewards
    if (streakDays > 0 && streakDays % 7 === 0) {
      const existingReward = await Reward.findOne({
        user: userId,
        badgeName: `${streakDays} Day Streak`,
      });

      if (!existingReward) {
        await Reward.create({
          user: userId,
          badgeName: `${streakDays} Day Streak`,
          badgeType: "streak",
          pointsEarned: streakDays * 5,
          pointsRequired: 0,
          unlocked: true,
          unlockedAt: Date.now(),
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
          points: user.points,
          streakDays: user.streakDays,
          questionnaireCompleted: user.questionnaireCompleted,
          role: user.role,
        },
        allowancePlan,
        hobbies,
        rewards: rewards.slice(0, 5), // Latest 5 rewards
        activeChallenges,
        recentProofs,
        stats: {
          totalHobbies: hobbies.length,
          completedHobbies: hobbies.filter((h) => h.status === "completed").length,
          totalProofs: await ProofSubmission.countDocuments({ user: userId }),
          verifiedProofs: await ProofSubmission.countDocuments({
            user: userId,
            verified: true,
          }),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

