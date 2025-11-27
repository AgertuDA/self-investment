const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const ProofSubmission = require("../models/ProofSubmission");
const Challenge = require("../models/Challenge");
const Hobby = require("../models/Hobby");

// @desc    Get admin dashboard data
exports.getAdminDashboard = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorResponse("Not authorized as admin", 401));
    }

    // Get pending proofs
    const pendingProofs = await ProofSubmission.find({ verified: false })
      .populate("user", "username email")
      .populate("hobby", "hobbyName")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get all challenges
    const challenges = await Challenge.find().sort({ createdAt: -1 }).limit(10);

    // Get user statistics
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalHobbies = await Hobby.countDocuments();
    const totalProofs = await ProofSubmission.countDocuments();
    const verifiedProofs = await ProofSubmission.countDocuments({ verified: true });
    const pendingProofsCount = await ProofSubmission.countDocuments({ verified: false });

    // Get recent users
    const recentUsers = await User.find({ role: "user" })
      .select("username email points streakDays createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalAdmins,
          totalHobbies,
          totalProofs,
          verifiedProofs,
          pendingProofs: pendingProofsCount,
        },
        pendingProofs,
        challenges,
        recentUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

