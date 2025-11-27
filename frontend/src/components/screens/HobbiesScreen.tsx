import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./HobbiesScreen.css";
import { url } from "../../helpers/url";

const HobbiesScreen = () => {
  const [hobbies, setHobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hobbyName, setHobbyName] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(url + "/api/hobbies", config);
      if (data.success) {
        setHobbies(data.data);
      }
    } catch (error: any) {
      setError("Failed to load hobbies");
    } finally {
      setLoading(false);
    }
  };

  const addHobby = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.post(
        url + "/api/hobbies",
        { hobbyName, frequency },
        config
      );
      if (data.success) {
        setHobbies([...hobbies, data.data]);
        setHobbyName("");
        setFrequency("weekly");
        setShowAddForm(false);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to add hobby");
    }
  };

  const deleteHobby = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hobby?")) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.delete(url + `/api/hobbies/${id}`, config);
      setHobbies(hobbies.filter((h) => h._id !== id));
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete hobby");
    }
  };

  const completeHobby = async (id: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.put(
        url + `/api/hobbies/${id}/complete`,
        {},
        config
      );
      if (data.success) {
        fetchHobbies();
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update hobby");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="hobbies-screen">
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

      <div className="hobbies-container">
        <div className="hobbies-header">
          <h1>My Hobbies</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Add Hobby"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm && (
          <form onSubmit={addHobby} className="add-hobby-form">
            <div className="form-group">
              <label>Hobby Name</label>
              <input
                type="text"
                required
                value={hobbyName}
                onChange={(e) => setHobbyName(e.target.value)}
                placeholder="e.g., Learning Spanish"
              />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Hobby
            </button>
          </form>
        )}

        <div className="hobbies-grid">
          {hobbies.length === 0 ? (
            <p>No hobbies yet. Add your first hobby to get started!</p>
          ) : (
            hobbies.map((hobby) => (
              <div key={hobby._id} className="hobby-card">
                <div className="hobby-card-header">
                  <h3>{hobby.hobbyName}</h3>
                  <span className={`hobby-status ${hobby.status}`}>
                    {hobby.status}
                  </span>
                </div>
                <div className="hobby-card-body">
                  <div className="hobby-info">
                    <span>Frequency: {hobby.frequency}</span>
                    <span>Points: {hobby.pointsEarned || 0}</span>
                  </div>
                  <div className="hobby-progress">
                    <div className="progress-label">
                      Progress: {hobby.progress}%
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${hobby.progress}%`,
                          backgroundColor:
                            hobby.progress === 100 ? "#4CAF50" : "#2196F3",
                        }}
                      />
                    </div>
                  </div>
                  <div className="hobby-actions">
                    <Link
                      to={`/proofs/submit?hobbyId=${hobby._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Submit Proof
                    </Link>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => completeHobby(hobby._id)}
                    >
                      Mark Progress
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteHobby(hobby._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HobbiesScreen;

