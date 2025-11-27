import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./QuestionnaireScreen.css";
import { url } from "../../helpers/url";

const QuestionnaireScreen = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [spendingHabits, setSpendingHabits] = useState("");
  const [spendingPriority, setSpendingPriority] = useState("");
  const [monthlyAllowance, setMonthlyAllowance] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const interestOptions = [
    "Art & Creativity",
    "Fitness & Health",
    "Technology",
    "Music",
    "Reading",
    "Sports",
    "Cooking",
    "Travel",
    "Photography",
    "Writing",
  ];

  const hobbyOptions = [
    "Learning a new language",
    "Playing a musical instrument",
    "Drawing/Painting",
    "Coding/Programming",
    "Reading books",
    "Exercise/Fitness",
    "Cooking/Baking",
    "Photography",
    "Writing/Blogging",
    "Meditation",
  ];

  const goalOptions = [
    "Save money",
    "Learn new skills",
    "Improve health",
    "Build better habits",
    "Reduce stress",
    "Increase productivity",
  ];

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get(url + "/api/questionnaire", config);
        if (data.success && data.data) {
          setInterests(data.data.interests || []);
          setSpendingHabits(data.data.spendingHabits || "");
          setSpendingPriority(data.data.spendingPriority || "");
          setMonthlyAllowance(data.data.monthlyAllowance?.toString() || "");
          setHobbies(data.data.hobbies || []);
          setGoals(data.data.goals || []);
        }
      } catch (error: any) {
        console.error("Error fetching questionnaire:", error);
      }
    };

    fetchQuestionnaire();
  }, []);

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleHobbyToggle = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((h) => h !== hobby));
    } else {
      setHobbies([...hobbies, hobby]);
    }
  };

  const handleGoalToggle = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!spendingHabits || !spendingPriority || !monthlyAllowance) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.post(
        url + "/api/questionnaire",
        {
          interests,
          spendingHabits,
          spendingPriority,
          monthlyAllowance: parseFloat(monthlyAllowance),
          hobbies,
          goals,
        },
        config
      );

      if (data.success) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="questionnaire-screen">
      <div className="questionnaire-container">
        <h2 className="questionnaire-title">Personalization Questionnaire</h2>
        <p className="questionnaire-subtitle">
          Help us create a personalized plan for you
        </p>

        {error && <span className="error-message">{error}</span>}

        <form onSubmit={submitHandler} className="questionnaire-form">
          <div className="form-section">
            <label className="form-label">Monthly Allowance *</label>
            <input
              type="number"
              required
              className="form-input"
              placeholder="Enter your monthly allowance"
              value={monthlyAllowance}
              onChange={(e) => setMonthlyAllowance(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-section">
            <label className="form-label">Spending Habits *</label>
            <select
              required
              className="form-input"
              value={spendingHabits}
              onChange={(e) => setSpendingHabits(e.target.value)}
            >
              <option value="">Select spending habits</option>
              <option value="low">Low spender</option>
              <option value="moderate">Moderate spender</option>
              <option value="high">High spender</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Spending Priority *</label>
            <select
              required
              className="form-input"
              value={spendingPriority}
              onChange={(e) => setSpendingPriority(e.target.value)}
            >
              <option value="">Select priority</option>
              <option value="essentials">Essentials first</option>
              <option value="hobbies">Hobbies first</option>
              <option value="savings">Savings first</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Interests (Select all that apply)</label>
            <div className="checkbox-group">
              {interestOptions.map((interest) => (
                <label key={interest} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Hobbies (Select all that apply)</label>
            <div className="checkbox-group">
              {hobbyOptions.map((hobby) => (
                <label key={hobby} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hobbies.includes(hobby)}
                    onChange={() => handleHobbyToggle(hobby)}
                  />
                  <span>{hobby}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Goals (Select all that apply)</label>
            <div className="checkbox-group">
              {goalOptions.map((goal) => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit & Generate Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;

