import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./DashboardScreen.css";
import { url } from "../../helpers/url";

interface DashboardData {
  user: {
    username: string;
    email: string;
    points: number;
    streakDays: number;
    questionnaireCompleted: boolean;
    role: string;
  };
  allowancePlan: any;
  hobbies: any[];
  rewards: any[];
  activeChallenges: any[];
  recentProofs: any[];
  stats: {
    totalHobbies: number;
    completedHobbies: number;
    totalProofs: number;
    verifiedProofs: number;
  };
}

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get(url + "/api/dashboard", config);
        if (data.success) {
          setDashboardData(data.data);
          
          // Redirect to questionnaire if not completed (but not for admins)
          if (!data.data.user.questionnaireCompleted && data.data.user.role !== "admin") {
            navigate("/questionnaire");
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-screen">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-screen">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { user, allowancePlan, hobbies, rewards, activeChallenges, recentProofs, stats } = dashboardData;
  const isAdmin = user.role === "admin";

  return (
    <div className="dashboard-screen">
      <nav className="dashboard-nav">
        <div className="nav-brand">Self-Investment App</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          {!isAdmin && (
            <>
              <Link to="/hobbies">Hobbies</Link>
              <Link to="/proofs">Proofs</Link>
              <Link to="/challenges">Challenges</Link>
              <Link to="/rewards">Rewards</Link>
            </>
          )}
          <button onClick={logoutHandler} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.username}! {isAdmin && <span className="admin-badge">Admin</span>}</h1>
          {isAdmin ? (
            <div className="admin-notice">
              <p>You are viewing the admin dashboard. Switch to admin panel for management features.</p>
              <Link to="/admin" className="btn btn-primary">Go to Admin Panel</Link>
            </div>
          ) : (
            <div className="user-stats">
              <div className="stat-card">
                <div className="stat-value">{user.points}</div>
                <div className="stat-label">Points</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{user.streakDays}</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.completedHobbies}</div>
                <div className="stat-label">Completed Hobbies</div>
              </div>
            </div>
          )}
        </div>

        {isAdmin ? (
          <div className="admin-dashboard-preview">
            <div className="dashboard-card">
              <h2>Admin Quick Access</h2>
              <div className="admin-actions">
                <Link to="/admin" className="admin-action-card">
                  <h3>📋 Verify Proofs</h3>
                  <p>Review and verify pending proof submissions</p>
                </Link>
                <Link to="/admin/challenges" className="admin-action-card">
                  <h3>🎯 Manage Challenges</h3>
                  <p>View and manage challenges</p>
                </Link>
                <Link to="/admin/users" className="admin-action-card">
                  <h3>👥 View Users</h3>
                  <p>View user statistics and activity</p>
                </Link>
                <Link to="/admin/proofs" className="admin-action-card">
                  <h3>✅ Verify Proofs</h3>
                  <p>Review and verify pending proofs</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-card allowance-card">
            <h2>Allowance Plan</h2>
            {allowancePlan ? (
              <div className="allowance-details">
                <div className="allowance-summary">
                  <div className="summary-item">
                    <span className="summary-label">Monthly Budget:</span>
                    <span className="summary-value">
                      {allowancePlan.monthlyBudget?.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Weekly Budget:</span>
                    <span className="summary-value">
                      {allowancePlan.weeklyBudget?.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
                <div className="allocations">
                  <div className="allocation-item">
                    <div className="allocation-header">
                      <span>Essentials</span>
                      <span>{allowancePlan.allocations?.essentials?.toLocaleString()} RWF</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(allowancePlan.allocations?.essentials / allowancePlan.monthlyBudget) * 100}%`,
                          backgroundColor: "#4CAF50",
                        }}
                      />
                    </div>
                  </div>
                  <div className="allocation-item">
                    <div className="allocation-header">
                      <span>Hobbies</span>
                      <span>{allowancePlan.allocations?.hobbies?.toLocaleString()} RWF</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(allowancePlan.allocations?.hobbies / allowancePlan.monthlyBudget) * 100}%`,
                          backgroundColor: "#2196F3",
                        }}
                      />
                    </div>
                  </div>
                  <div className="allocation-item">
                    <div className="allocation-header">
                      <span>Savings</span>
                      <span>{allowancePlan.allocations?.savings?.toLocaleString()} RWF</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(allowancePlan.allocations?.savings / allowancePlan.monthlyBudget) * 100}%`,
                          backgroundColor: "#FF9800",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Complete the questionnaire to generate your allowance plan.</p>
            )}
          </div>

          <div className="dashboard-card hobbies-card">
            <h2>My Hobbies</h2>
            {hobbies.length > 0 ? (
              <div className="hobbies-list">
                {hobbies.slice(0, 5).map((hobby: any) => (
                  <div key={hobby._id} className="hobby-item">
                    <div className="hobby-info">
                      <h3>{hobby.hobbyName}</h3>
                      <span className={`hobby-status ${hobby.status}`}>
                        {hobby.status}
                      </span>
                    </div>
                    <div className="hobby-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${hobby.progress}%`,
                            backgroundColor: hobby.progress === 100 ? "#4CAF50" : "#2196F3",
                          }}
                        />
                      </div>
                      <span>{hobby.progress}%</span>
                    </div>
                  </div>
                ))}
                {hobbies.length > 5 && (
                  <Link to="/hobbies" className="view-all-link">
                    View all hobbies ({hobbies.length})
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <p>No hobbies yet. Add some hobbies to get started!</p>
                <Link to="/hobbies" className="btn btn-primary">
                  Add Hobby
                </Link>
              </div>
            )}
          </div>

          <div className="dashboard-card challenges-card">
            <h2>Active Challenges</h2>
            {activeChallenges.length > 0 ? (
              <div className="challenges-list">
                {activeChallenges.map((challenge: any) => (
                  <div key={challenge._id} className="challenge-item">
                    <h3>{challenge.challengeName}</h3>
                    <p>{challenge.description}</p>
                    <div className="challenge-reward">
                      Reward: {challenge.rewardPoints} points
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>No active challenges. Check out available challenges!</p>
                <Link to="/challenges" className="btn btn-primary">
                  View Challenges
                </Link>
              </div>
            )}
          </div>

          <div className="dashboard-card rewards-card">
            <h2>Recent Rewards</h2>
            {rewards.length > 0 ? (
              <div className="rewards-list">
                {rewards.map((reward: any) => (
                  <div key={reward._id} className="reward-item">
                    <div className="reward-badge">🏆</div>
                    <div className="reward-info">
                      <h3>{reward.badgeName}</h3>
                      <p>{reward.pointsEarned} points</p>
                    </div>
                  </div>
                ))}
                <Link to="/rewards" className="view-all-link">
                  View all rewards
                </Link>
              </div>
            ) : (
              <p>Complete tasks to earn rewards!</p>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;

