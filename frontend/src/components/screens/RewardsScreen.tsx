import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./RewardsScreen.css";
import { url } from "../../helpers/url";

const RewardsScreen = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(url + "/api/rewards/unlocked", config);
      if (data.success) {
        setRewards(data.data);
      }
    } catch (error: any) {
      setError("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const unlockedRewards = rewards.filter((r) => r.unlocked);
  const lockedRewards = rewards.filter((r) => !r.unlocked);

  return (
    <div className="rewards-screen">
      <nav className="dashboard-nav">
        <div className="nav-brand">Self-Investment App</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/hobbies">Hobbies</Link>
          <Link to="/proofs">Proofs</Link>
          <Link to="/challenges">Challenges</Link>
          <Link to="/rewards">Rewards</Link>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
            className="btn-logout"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="rewards-container">
        <h1>My Rewards & Achievements</h1>
        <p className="rewards-subtitle">
          Track your progress and celebrate your achievements!
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="rewards-section">
          <h2>Unlocked Rewards ({unlockedRewards.length})</h2>
          {unlockedRewards.length === 0 ? (
            <p>Complete tasks and challenges to unlock rewards!</p>
          ) : (
            <div className="rewards-grid">
              {unlockedRewards.map((reward) => (
                <div key={reward._id} className="reward-card unlocked">
                  <div className="reward-icon">🏆</div>
                  <div className="reward-content">
                    <h3>{reward.badgeName}</h3>
                    <p className="reward-type">{reward.badgeType}</p>
                    <p className="reward-points">
                      {reward.pointsEarned} points earned
                    </p>
                    {reward.unlockedAt && (
                      <p className="reward-date">
                        Unlocked: {new Date(reward.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lockedRewards.length > 0 && (
          <div className="rewards-section">
            <h2>Locked Rewards ({lockedRewards.length})</h2>
            <div className="rewards-grid">
              {lockedRewards.map((reward) => (
                <div key={reward._id} className="reward-card locked">
                  <div className="reward-icon">🔒</div>
                  <div className="reward-content">
                    <h3>{reward.badgeName}</h3>
                    <p className="reward-type">{reward.badgeType}</p>
                    <p className="reward-points">
                      Requires: {reward.pointsRequired} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsScreen;

