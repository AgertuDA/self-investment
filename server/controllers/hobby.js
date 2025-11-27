const ErrorResponse = require("../utils/errorResponse");
const Hobby = require("../models/Hobby");
const User = require("../models/User");

// @desc    Get all hobbies for user
exports.getHobbies = async (req, res, next) => {
  try {
    const hobbies = await Hobby.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hobbies.length,
      data: hobbies,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create hobby
exports.createHobby = async (req, res, next) => {
  try {
    const { hobbyName, frequency } = req.body;

    const hobby = await Hobby.create({
      user: req.user._id,
      hobbyName,
      frequency: frequency || "weekly",
    });

    res.status(201).json({
      success: true,
      data: hobby,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update hobby
exports.updateHobby = async (req, res, next) => {
  try {
    const { hobbyName, frequency, progress, status } = req.body;

    let hobby = await Hobby.findById(req.params.id);

    if (!hobby) {
      return next(new ErrorResponse("Hobby not found", 404));
    }

    // Make sure user owns the hobby
    if (hobby.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("Not authorized to update this hobby", 401));
    }

    hobby = await Hobby.findByIdAndUpdate(
      req.params.id,
      { hobbyName, frequency, progress, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: hobby,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete hobby
exports.deleteHobby = async (req, res, next) => {
  try {
    const hobby = await Hobby.findById(req.params.id);

    if (!hobby) {
      return next(new ErrorResponse("Hobby not found", 404));
    }

    // Make sure user owns the hobby
    if (hobby.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("Not authorized to delete this hobby", 401));
    }

    await hobby.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark hobby as completed
exports.completeHobby = async (req, res, next) => {
  try {
    let hobby = await Hobby.findById(req.params.id);

    if (!hobby) {
      return next(new ErrorResponse("Hobby not found", 404));
    }

    if (hobby.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("Not authorized", 401));
    }

    // Update progress and last completed date
    hobby.progress = Math.min(100, hobby.progress + 10);
    hobby.lastCompleted = Date.now();

    if (hobby.progress >= 100) {
      hobby.status = "completed";
    }

    await hobby.save();

    res.status(200).json({
      success: true,
      data: hobby,
    });
  } catch (err) {
    next(err);
  }
};

