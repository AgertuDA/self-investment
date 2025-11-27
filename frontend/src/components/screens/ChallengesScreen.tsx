import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ChallengesScreen.css";
import { url } from "../../helpers/url";

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(url + "/api/challenges", config);
      if (data.success) {
        setChallenges(data.data);
      }
    } catch (error: any) {
      setError("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (id: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.post(
        url + `/api/challenges/${id}/join`,
        {},
        config
      );
      if (data.success) {
        fetchChallenges();
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to join challenge");
    }
  };

  const completeChallenge = async (id: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.post(
        url + `/api/challenges/${id}/complete`,
        {},
        config
      );
      if (data.success) {
        fetchChallenges();
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to complete challenge");
    }
  };

  const isParticipant = (challenge: any) => {
    return challenge.isParticipant || false;
  };

  const isCompleted = (challenge: any) => {
    return challenge.isCompleted || false;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="challenges-screen">
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

      <div className="challenges-container">
        <h1>Challenges</h1>
        <p className="challenges-subtitle">
          Participate in challenges to earn extra points and rewards!
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="challenges-grid">
          {challenges.length === 0 ? (
            <p>No active challenges at the moment. Check back later!</p>
          ) : (
            challenges.map((challenge) => {
              const participant = isParticipant(challenge);
              const completed = isCompleted(challenge);
              const startDate = new Date(challenge.startDate);
              const endDate = new Date(challenge.endDate);
              const now = new Date();
              const isActive = now >= startDate && now <= endDate;

              return (
                <div key={challenge._id} className="challenge-card">
                  <div className="challenge-header">
                    <h2>{challenge.challengeName}</h2>
                    <span className={`challenge-status ${challenge.status}`}>
                      {challenge.status}
                    </span>
                  </div>
                  <div className="challenge-body">
                    <p className="challenge-description">
                      {challenge.description}
                    </p>
                    <div className="challenge-dates">
                      <div>
                        <strong>Start:</strong>{" "}
                        {startDate.toLocaleDateString()}
                      </div>
                      <div>
                        <strong>End:</strong> {endDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="challenge-reward">
                      <strong>Reward:</strong> {challenge.rewardPoints} points
                    </div>
                    <div className="challenge-participants">
                      {challenge.participants?.length || 0} participant(s)
                    </div>
                    <div className="challenge-actions">
                      {completed ? (
                        <span className="challenge-completed">
                          ✓ Completed
                        </span>
                      ) : participant ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => completeChallenge(challenge._id)}
                          disabled={!isActive}
                        >
                          {isActive ? "Complete Challenge" : "Not Active"}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => joinChallenge(challenge._id)}
                          disabled={!isActive}
                        >
                          {isActive ? "Join Challenge" : "Not Active"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesScreen;

