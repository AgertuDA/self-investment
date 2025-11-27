const ErrorResponse = require("../utils/errorResponse");
const Questionnaire = require("../models/Questionnaire");
const AllowancePlan = require("../models/AllowancePlan");
const User = require("../models/User");

// @desc    Submit questionnaire
exports.submitQuestionnaire = async (req, res, next) => {
  try {
    const { interests, spendingHabits, spendingPriority, monthlyAllowance, hobbies, goals } = req.body;
    const userId = req.user._id;

    // Check if questionnaire already exists
    let questionnaire = await Questionnaire.findOne({ user: userId });

    if (questionnaire) {
      // Update existing questionnaire
      questionnaire = await Questionnaire.findOneAndUpdate(
        { user: userId },
        { interests, spendingHabits, spendingPriority, monthlyAllowance, hobbies, goals },
        { new: true, runValidators: true }
      );
    } else {
      // Create new questionnaire
      questionnaire = await Questionnaire.create({
        user: userId,
        interests,
        spendingHabits,
        spendingPriority,
        monthlyAllowance,
        hobbies,
        goals,
      });
    }

    // Update user profile
    await User.findByIdAndUpdate(userId, {
      "profile.interests": interests,
      "profile.spendingPriority": spendingPriority,
      questionnaireCompleted: true,
    });

    // Generate personalized allowance plan
    const weeklyBudget = monthlyAllowance / 4;
    let allocations = {
      essentials: 0,
      hobbies: 0,
      savings: 0,
    };

    // Calculate allocations based on spending priority
    switch (spendingPriority) {
      case "essentials":
        allocations.essentials = monthlyAllowance * 0.7;
        allocations.hobbies = monthlyAllowance * 0.15;
        allocations.savings = monthlyAllowance * 0.15;
        break;
      case "hobbies":
        allocations.essentials = monthlyAllowance * 0.5;
        allocations.hobbies = monthlyAllowance * 0.3;
        allocations.savings = monthlyAllowance * 0.2;
        break;
      case "savings":
        allocations.essentials = monthlyAllowance * 0.5;
        allocations.hobbies = monthlyAllowance * 0.2;
        allocations.savings = monthlyAllowance * 0.3;
        break;
      case "balanced":
      default:
        allocations.essentials = monthlyAllowance * 0.6;
        allocations.hobbies = monthlyAllowance * 0.2;
        allocations.savings = monthlyAllowance * 0.2;
        break;
    }

    // Create or update allowance plan
    let allowancePlan = await AllowancePlan.findOne({ user: userId });
    if (allowancePlan) {
      allowancePlan = await AllowancePlan.findOneAndUpdate(
        { user: userId },
        {
          weeklyBudget,
          monthlyBudget: monthlyAllowance,
          allocations,
          savingsGoal: allocations.savings,
          categories: ["Essentials", "Hobbies", "Savings"],
        },
        { new: true }
      );
    } else {
      allowancePlan = await AllowancePlan.create({
        user: userId,
        weeklyBudget,
        monthlyBudget: monthlyAllowance,
        allocations,
        savingsGoal: allocations.savings,
        categories: ["Essentials", "Hobbies", "Savings"],
      });
    }

    res.status(200).json({
      success: true,
      data: {
        questionnaire,
        allowancePlan,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get questionnaire
exports.getQuestionnaire = async (req, res, next) => {
  try {
    const questionnaire = await Questionnaire.findOne({ user: req.user._id });

    if (!questionnaire) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: questionnaire,
    });
  } catch (err) {
    next(err);
  }
};

