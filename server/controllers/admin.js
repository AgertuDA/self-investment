const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Create admin user (one-time setup, no auth required for first admin)
exports.createAdmin = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return next(
        new ErrorResponse("Please provide email, username, and password", 400)
      );
    }

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    // If admin exists, require authentication
    if (existingAdmin) {
      // Try to get user from token (might not exist if no auth)
      let isAdmin = false;
      if (req.headers.authorization) {
        try {
          const jwt = require("jsonwebtoken");
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          isAdmin = user && user.role === "admin";
        } catch (err) {
          // Invalid token, continue to check
        }
      }
      
      if (!isAdmin) {
        return next(
          new ErrorResponse(
            "Admin already exists. Only existing admins can create new admins.",
            403
          )
        );
      }
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "admin";
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "User has been updated to admin role",
        data: {
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
        },
      });
    }

    // Create new admin user
    const admin = await User.create({
      username,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all admins (Admin only)
exports.getAdmins = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorResponse("Not authorized as admin", 401));
    }

    const admins = await User.find({ role: "admin" }).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};

