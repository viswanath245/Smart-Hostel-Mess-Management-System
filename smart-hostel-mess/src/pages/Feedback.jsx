import { useEffect, useState } from "react";
import {
  Star,
  Vote,
  MessageSquareWarning,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [complaint, setComplaint] = useState("");
  const [selectedVote, setSelectedVote] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [message, setMessage] = useState("");

  const [meals, setMeals] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [submittingComplaint, setSubmittingComplaint] =
    useState(false);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [mealsResponse, menuResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/meals", {
              headers,
            }),
            fetch("http://localhost:5000/api/menu", {
              headers,
            }),
          ]);

        const mealsData = await mealsResponse.json();
        const menuData = await menuResponse.json();

        if (!mealsResponse.ok) {
          alert(
            mealsData.message ||
              "Failed to load meals."
          );
          return;
        }

        if (!menuResponse.ok) {
          alert(
            menuData.message ||
              "Failed to load menu items."
          );
          return;
        }

        setMeals(mealsData.meals || []);

        const uniqueFoodItems = [
          ...new Set(
            (menuData.menu || [])
              .map((item) => item.foodItem)
              .filter(Boolean)
          ),
        ];

        setMenuItems(uniqueFoodItems);
      } catch (error) {
        console.error("Feedback data error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [navigate]);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const submitReview = async () => {
    if (!selectedMeal) {
      alert("Please select a meal.");
      return;
    }

    if (!review.trim()) {
      alert("Please enter a review.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setSubmittingReview(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: selectedMeal,
            rating,
            comment: review.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit review.");
        return;
      }

      setReview("");
      setSelectedMeal("");
      showMessage("Your food review has been submitted.");
    } catch (error) {
      console.error("Review submission error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitComplaint = async () => {
    if (!complaint.trim()) {
      alert("Please enter your complaint.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setSubmittingComplaint(true);

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject: "Mess Complaint",
            description: complaint.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to submit complaint."
        );
        return;
      }

      setComplaint("");
      showMessage("Your complaint has been submitted.");
    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const submitVote = async () => {
    if (!selectedVote) {
      alert("Please select a menu item.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setSubmittingVote(true);

      const response = await fetch(
        "http://localhost:5000/api/votes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodItem: selectedVote,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit vote.");
        return;
      }

      showMessage(
        `Your vote for ${selectedVote} was recorded.`
      );
      setSelectedVote("");
    } catch (error) {
      console.error("Vote submission error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSubmittingVote(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">STUDENT VOICE</p>
            <h1>Feedback Center</h1>
            <p className="page-description">
              Share your thoughts and help improve the mess.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading feedback options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">STUDENT VOICE</p>
          <h1>Feedback Center</h1>
          <p className="page-description">
            Share your thoughts and help improve the mess.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-banner">
          <CheckCircle2 size={20} />
          <span>{message}</span>
        </div>
      )}

      <div className="feedback-grid">
        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <Star size={21} />
            </div>

            <div>
              <h3>Food Review</h3>
              <p>Rate your recent mess experience.</p>
            </div>
          </div>

          <div className="input-group">
            <label>Select Meal</label>

            <select
              value={selectedMeal}
              onChange={(e) =>
                setSelectedMeal(e.target.value)
              }
            >
              <option value="">
                Select a meal
              </option>

              {meals.map((meal) => (
                <option
                  key={meal._id}
                  value={meal._id}
                >
                  {meal.mealType} - {meal.mealName}
                </option>
              ))}
            </select>
          </div>

          <div className="rating-row">
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                type="button"
                key={item}
                className={`star-button ${
                  item <= rating ? "selected" : ""
                }`}
                onClick={() => setRating(item)}
              >
                <Star size={23} />
              </button>
            ))}
          </div>

          <div className="input-group">
            <label>Your Review</label>

            <textarea
              placeholder="Tell us about the food..."
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
            />
          </div>

          <button
            className="primary-button"
            onClick={submitReview}
            disabled={submittingReview}
          >
            {submittingReview
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>

        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <Vote size={21} />
            </div>

            <div>
              <h3>Menu Voting</h3>
              <p>Choose a food item for future menus.</p>
            </div>
          </div>

          {menuItems.length === 0 ? (
            <p>No menu items available.</p>
          ) : (
            <div className="vote-list">
              {menuItems.map((item) => (
                <label
                  className={`vote-option ${
                    selectedVote === item
                      ? "selected"
                      : ""
                  }`}
                  key={item}
                >
                  <input
                    type="radio"
                    name="menuVote"
                    value={item}
                    checked={selectedVote === item}
                    onChange={(e) =>
                      setSelectedVote(e.target.value)
                    }
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>
          )}

          <button
            className="secondary-button"
            onClick={submitVote}
            disabled={submittingVote}
          >
            {submittingVote
              ? "Submitting..."
              : "Submit Vote"}
          </button>
        </div>

        <div className="content-card full-width">
          <div className="card-heading">
            <div className="card-heading-icon danger-icon">
              <MessageSquareWarning size={21} />
            </div>

            <div>
              <h3>Submit a Complaint</h3>
              <p>
                Report an issue regarding food or mess
                services.
              </p>
            </div>
          </div>

          <div className="input-group">
            <label>Complaint Details</label>

            <textarea
              placeholder="Describe the issue..."
              value={complaint}
              onChange={(e) =>
                setComplaint(e.target.value)
              }
            />
          </div>

          <button
            className="secondary-button"
            onClick={submitComplaint}
            disabled={submittingComplaint}
          >
            {submittingComplaint
              ? "Submitting..."
              : "Submit Complaint"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;