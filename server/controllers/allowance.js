const ErrorResponse = require("../utils/errorResponse");
const AllowancePlan = require("../models/AllowancePlan");

// @desc    Get allowance plan
exports.getAllowancePlan = async (req, res, next) => {
  try {
    const allowancePlan = await AllowancePlan.findOne({ user: req.user._id });

    if (!allowancePlan) {
      return next(new ErrorResponse("Allowance plan not found. Please complete the questionnaire first.", 404));
    }

    res.status(200).json({
      success: true,
      data: allowancePlan,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update allowance plan
exports.updateAllowancePlan = async (req, res, next) => {
  try {
    const { weeklyBudget, monthlyBudget, allocations, savingsGoal } = req.body;

    let allowancePlan = await AllowancePlan.findOne({ user: req.user._id });

    if (!allowancePlan) {
      return next(new ErrorResponse("Allowance plan not found", 404));
    }

    allowancePlan = await AllowancePlan.findOneAndUpdate(
      { user: req.user._id },
      { weeklyBudget, monthlyBudget, allocations, savingsGoal },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: allowancePlan,
    });
  } catch (err) {
    next(err);
  }
};

