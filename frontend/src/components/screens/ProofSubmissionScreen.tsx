import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "./ProofSubmissionScreen.css";
import { url } from "../../helpers/url";

const ProofSubmissionScreen = () => {
  const [proofs, setProofs] = useState<any[]>([]);
  const [hobbies, setHobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState("");
  const [submission, setSubmission] = useState("");
  const [submissionType, setSubmissionType] = useState("text");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const hobbyId = searchParams.get("hobbyId");
    if (hobbyId) {
      setSelectedHobby(hobbyId);
      setShowSubmitForm(true);
    }
    fetchProofs();
    fetchHobbies();
  }, [searchParams]);

  const fetchProofs = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get(url + "/api/proofs", config);
      if (data.success) {
        setProofs(data.data);
      }
    } catch (error: any) {
      setError("Failed to load proofs");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Failed to load hobbies");
    }
  };

  const submitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHobby || !submission) {
      setError("Please fill in all fields");
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
        url + "/api/proofs",
        {
          hobbyId: selectedHobby,
          submission,
          submissionType,
        },
        config
      );
      if (data.success) {
        setProofs([data.data, ...proofs]);
        setSubmission("");
        setSelectedHobby("");
        setShowSubmitForm(false);
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to submit proof");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="proofs-screen">
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

      <div className="proofs-container">
        <div className="proofs-header">
          <h1>Proof Submissions</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
          >
            {showSubmitForm ? "Cancel" : "Submit Proof"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showSubmitForm && (
          <form onSubmit={submitProof} className="submit-proof-form">
            <div className="form-group">
              <label>Select Hobby</label>
              <select
                required
                value={selectedHobby}
                onChange={(e) => setSelectedHobby(e.target.value)}
              >
                <option value="">Choose a hobby</option>
                {hobbies.map((hobby) => (
                  <option key={hobby._id} value={hobby._id}>
                    {hobby.hobbyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Submission Type</label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="image">Image URL</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div className="form-group">
              <label>Proof Submission</label>
              {submissionType === "text" ? (
                <textarea
                  required
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Describe what you did or paste your proof..."
                  rows={5}
                />
              ) : (
                <input
                  type="text"
                  required
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder={
                    submissionType === "image"
                      ? "Paste image URL"
                      : "Paste link"
                  }
                />
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Proof
            </button>
          </form>
        )}

        <div className="proofs-list">
          {proofs.length === 0 ? (
            <p>No proof submissions yet. Submit your first proof!</p>
          ) : (
            proofs.map((proof) => (
              <div
                key={proof._id}
                className={`proof-card ${proof.verified ? "verified" : "pending"}`}
              >
                <div className="proof-card-header">
                  <h3>{proof.hobby?.hobbyName || "Unknown Hobby"}</h3>
                  <span
                    className={`proof-status ${proof.verified ? "verified" : "pending"}`}
                  >
                    {proof.verified ? "✓ Verified" : "Pending"}
                  </span>
                </div>
                <div className="proof-card-body">
                  <div className="proof-submission">
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
                      >
                        {proof.submission}
                      </a>
                    ) : (
                      <p>{proof.submission}</p>
                    )}
                  </div>
                  {proof.verified && (
                    <div className="proof-reward">
                      <span>Points Awarded: {proof.pointsAwarded || 0}</span>
                    </div>
                  )}
                  <div className="proof-date">
                    Submitted: {new Date(proof.createdAt).toLocaleDateString()}
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

export default ProofSubmissionScreen;

