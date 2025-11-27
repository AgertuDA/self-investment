const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Send reminder to inactive users
exports.sendInactiveReminders = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorResponse("Not authorized as admin", 401));
    }

    const daysInactive = 7; // Users inactive for 7 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const inactiveUsers = await User.find({
      lastActivityDate: { $lt: cutoffDate },
      role: "user",
    });

    let emailsSent = 0;
    for (const user of inactiveUsers) {
      try {
        const message = `
          <h1>Welcome back to Self-Investment App!</h1>
          <p>Hi ${user.username},</p>
          <p>We noticed you haven't been active on the Self-Investment App for a while. Don't forget to invest in yourself!</p>
          <p>Log in to continue tracking your allowance, hobbies, and earning rewards.</p>
          <p>Your current points: ${user.points}</p>
          <p>Your current streak: ${user.streakDays} days</p>
          <a href="http://localhost:5173/login">Log in now</a>
        `;

        await sendEmail({
          to: user.email,
          subject: "Reminder: Continue Your Self-Investment Journey",
          text: message,
        });

        emailsSent++;
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }

    res.status(200).json({
      success: true,
      message: `Reminders sent to ${emailsSent} inactive users`,
      count: emailsSent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send reminder to user with pending tasks
exports.sendPendingTaskReminder = async (req, res, next) => {
  try {
    const ProofSubmission = require("../models/ProofSubmission");
    const Hobby = require("../models/Hobby");

    const userId = req.user._id;
    const user = await User.findById(userId);

    // Get pending proofs
    const pendingProofs = await ProofSubmission.countDocuments({
      user: userId,
      verified: false,
    });

    // Get in-progress hobbies
    const inProgressHobbies = await Hobby.countDocuments({
      user: userId,
      status: "in-progress",
    });

    if (pendingProofs > 0 || inProgressHobbies > 0) {
      const message = `
        <h1>You have pending tasks!</h1>
        <p>Hi ${user.username},</p>
        <p>You have ${pendingProofs} proof submission(s) pending verification.</p>
        <p>You have ${inProgressHobbies} hobby/hobbies in progress.</p>
        <p>Keep up the great work and continue investing in yourself!</p>
        <a href="http://localhost:5173/">View Dashboard</a>
      `;

      await sendEmail({
        to: user.email,
        subject: "Reminder: Pending Tasks in Self-Investment App",
        text: message,
      });

      res.status(200).json({
        success: true,
        message: "Reminder sent",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No pending tasks",
      });
    }
  } catch (err) {
    next(err);
  }
};

