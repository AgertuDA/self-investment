import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./AdminPanelScreen.css";
import { url } from "../../helpers/url";

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalHobbies: number;
    totalProofs: number;
    verifiedProofs: number;
    pendingProofs: number;
  };
  pendingProofs: any[];
  challenges: any[];
  recentUsers: any[];
}

const AdminPanelScreen = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get tab from URL or default to overview
  const getTabFromUrl = () => {
    const path = location.pathname;
    if (path.includes("/challenges")) return "challenges";
    if (path.includes("/users")) return "users";
    if (path.includes("/proofs")) return "proofs";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  const [pointsAwarded, setPointsAwarded] = useState<{ [key: string]: number }>({});
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    challengeName: "",
    description: "",
    startDate: "",
    endDate: "",
    rewardPoints: 50,
  });

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.pathname]);

  const fetchAdminDashboard = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(url + "/api/admin/dashboard", config);
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("You are not authorized as an admin");
      } else {
        setError("Failed to load admin dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyProof = async (proofId: string) => {
    const points = pointsAwarded[proofId] || 10;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.put(
        url + `/api/proofs/${proofId}/verify`,
        { pointsAwarded: points },
        config
      );
      if (data.success) {
        fetchAdminDashboard();
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to verify proof");
    }
  };

  const createChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.post(
        url + "/api/challenges",
        challengeForm,
        config
      );
      if (data.success) {
        fetchAdminDashboard();
        setShowCreateChallenge(false);
        setChallengeForm({
          challengeName: "",
          description: "",
          startDate: "",
          endDate: "",
          rewardPoints: 50,
        });
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create challenge");
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !dashboardData) {
    return (
      <div className="admin-panel-screen">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, pendingProofs, challenges, recentUsers } = dashboardData;

  return (
    <div className="admin-panel-screen">
      <nav className="dashboard-nav">
        <div className="nav-brand">Self-Investment App - Admin Panel</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin">Admin Panel</Link>
          <button onClick={logoutHandler} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-tabs">
            <Link
              to="/admin"
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Link>
            <Link
              to="/admin/proofs"
              className={activeTab === "proofs" ? "active" : ""}
              onClick={() => setActiveTab("proofs")}
            >
              Verify Proofs ({pendingProofs.length})
            </Link>
            <Link
              to="/admin/challenges"
              className={activeTab === "challenges" ? "active" : ""}
              onClick={() => setActiveTab("challenges")}
            >
              Challenges
            </Link>
            <Link
              to="/admin/users"
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </Link>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === "overview" && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Total Admins</h3>
                <div className="stat-value">{stats.totalAdmins}</div>
              </div>
              <div className="stat-card">
                <h3>Total Hobbies</h3>
                <div className="stat-value">{stats.totalHobbies}</div>
              </div>
              <div className="stat-card">
                <h3>Total Proofs</h3>
                <div className="stat-value">{stats.totalProofs}</div>
              </div>
              <div className="stat-card">
                <h3>Verified Proofs</h3>
                <div className="stat-value">{stats.verifiedProofs}</div>
              </div>
              <div className="stat-card">
                <h3>Pending Proofs</h3>
                <div className="stat-value pending">{stats.pendingProofs}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "proofs" && (
          <div className="admin-proofs">
            <h2>Pending Proof Submissions</h2>
            {pendingProofs.length === 0 ? (
              <p>No pending proofs to verify.</p>
            ) : (
              <div className="proofs-list">
                {pendingProofs.map((proof) => (
                  <div key={proof._id} className="proof-card">
                    <div className="proof-header">
                      <div>
                        <h3>{proof.hobby?.hobbyName || "Unknown Hobby"}</h3>
                        <p className="proof-user">
                          Submitted by: {proof.user?.username} ({proof.user?.email})
                        </p>
                        <p className="proof-date">
                          {new Date(proof.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="proof-content">
                      {proof.submissionType === "image" ? (
                        <img
                          src={proof.submission}
                          alt="Proof"
                          className="proof-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : proof.submissionType === "link" ? (
                        <a
                          href={proof.submission}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proof-link"
                        >
                          {proof.submission}
                        </a>
                      ) : (
                        <p className="proof-text">{proof.submission}</p>
                      )}
                    </div>
                    <div className="proof-actions">
                      <div className="points-input">
                        <label>Points to Award:</label>
                        <input
                          type="number"
                          min="1"
                          value={pointsAwarded[proof._id] || 10}
                          onChange={(e) =>
                            setPointsAwarded({
                              ...pointsAwarded,
                              [proof._id]: parseInt(e.target.value) || 10,
                            })
                          }
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => verifyProof(proof._id)}
                      >
                        Verify & Award Points
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="admin-challenges">
            <div className="challenges-header">
              <h2>Challenges</h2>
              <div className="challenges-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/challenges")}
                >
                  View All Challenges
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateChallenge(!showCreateChallenge)}
                >
                  {showCreateChallenge ? "Cancel" : "Create Challenge"}
                </button>
              </div>
            </div>

            {showCreateChallenge && (
              <form onSubmit={createChallenge} className="create-challenge-form">
                <div className="form-group">
                  <label>Challenge Name *</label>
                  <input
                    type="text"
                    required
                    value={challengeForm.challengeName}
                    onChange={(e) =>
                      setChallengeForm({
                        ...challengeForm,
                        challengeName: e.target.value,
                      })
                    }
                    placeholder="e.g., October Budget Challenge"
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    value={challengeForm.description}
                    onChange={(e) =>
                      setChallengeForm({
                        ...challengeForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the challenge..."
                    rows={4}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="datetime-local"
                      required
                      value={challengeForm.startDate}
                      onChange={(e) =>
                        setChallengeForm({
                          ...challengeForm,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="datetime-local"
                      required
                      value={challengeForm.endDate}
                      onChange={(e) =>
                        setChallengeForm({
                          ...challengeForm,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Reward Points</label>
                  <input
                    type="number"
                    min="1"
                    value={challengeForm.rewardPoints}
                    onChange={(e) =>
                      setChallengeForm({
                        ...challengeForm,
                        rewardPoints: parseInt(e.target.value) || 50,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Challenge
                </button>
              </form>
            )}

            <div className="challenges-list">
              {challenges.length === 0 ? (
                <p>No challenges yet. Create your first challenge!</p>
              ) : (
                challenges.map((challenge) => (
                  <div key={challenge._id} className="challenge-card">
                    <h3>{challenge.challengeName}</h3>
                    <p>{challenge.description}</p>
                    <div className="challenge-info">
                      <span>Status: {challenge.status}</span>
                      <span>Reward: {challenge.rewardPoints} points</span>
                      <span>Participants: {challenge.participants?.length || 0}</span>
                    </div>
                    <div className="challenge-dates">
                      <span>
                        Start: {new Date(challenge.startDate).toLocaleString()}
                      </span>
                      <span>
                        End: {new Date(challenge.endDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-users">
            <h2>Recent Users</h2>
            <div className="users-list">
              {recentUsers.length === 0 ? (
                <p>No users yet.</p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Points</th>
                      <th>Streak</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.points || 0}</td>
                        <td>{user.streakDays || 0} days</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelScreen;

