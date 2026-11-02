import {
  Trophy,
  Star,
  Gift,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Rewards() {
  const navigate = useNavigate();

  const [totalPoints, setTotalPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/rewards/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message || "Failed to load rewards."
          );
          return;
        }

        setTotalPoints(data.totalPoints || 0);
        setRewards(data.rewards || []);
      } catch (error) {
        console.error("Rewards fetch error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [navigate]);

  const feedbackPoints = rewards
    .filter((reward) =>
      reward.reason
        ?.toLowerCase()
        .includes("feedback")
    )
    .reduce(
      (total, reward) =>
        total + (reward.pointsEarned || 0),
      0
    );

  const votingPoints = rewards
    .filter((reward) =>
      reward.reason
        ?.toLowerCase()
        .includes("voting")
    )
    .reduce(
      (total, reward) =>
        total + (reward.pointsEarned || 0),
      0
    );

  const otherPoints = rewards
    .filter((reward) => {
      const reason = reward.reason?.toLowerCase() || "";

      return (
        !reason.includes("feedback") &&
        !reason.includes("voting")
      );
    })
    .reduce(
      (total, reward) =>
        total + (reward.pointsEarned || 0),
      0
    );

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">REWARDS</p>
            <h1>Your Rewards</h1>
            <p className="page-description">
              Track your participation and earned reward
              points.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">REWARDS</p>
          <h1>Your Rewards</h1>
          <p className="page-description">
            Track your participation and earned reward
            points.
          </p>
        </div>
      </div>

      <div className="reward-hero">
        <div className="reward-icon-large">
          <Trophy size={32} />
        </div>

        <div>
          <p>Total Reward Points</p>
          <h2>{totalPoints}</h2>
          <span>
            Keep participating to earn more.
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <Star size={20} />
          </div>

          <div>
            <span>Food Feedback</span>
            <strong>{feedbackPoints}</strong>
            <small>Points earned</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <Gift size={20} />
          </div>

          <div>
            <span>Other Activities</span>
            <strong>{otherPoints}</strong>
            <small>Points earned</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Menu Voting</span>
            <strong>{votingPoints}</strong>
            <small>Points earned</small>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">REWARD HISTORY</p>
            <h3>Earned Points</h3>
          </div>
        </div>

        {rewards.length === 0 ? (
          <p>
            No reward points have been earned yet.
          </p>
        ) : (
          <div className="reward-rules">
            {rewards.map((reward) => (
              <div key={reward._id}>
                <Star size={18} />

                <span>
                  <strong>
                    +{reward.pointsEarned} points
                  </strong>
                  {" — "}
                  {reward.reason}
                  {" • "}
                  {formatDate(reward.rewardDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">HOW IT WORKS</p>
            <h3>Earn More Points</h3>
          </div>
        </div>

        <div className="reward-rules">
          <div>
            <Star size={18} />
            <span>
              Provide useful food feedback.
            </span>
          </div>

          <div>
            <VoteIcon />
            <span>
              Participate in menu voting.
            </span>
          </div>

          <div>
            <TrendingUp size={18} />
            <span>
              Participate regularly in mess activities.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoteIcon() {
  return <span className="simple-symbol">✓</span>;
}

export default Rewards;