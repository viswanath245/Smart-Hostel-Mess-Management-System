import { useEffect, useState } from "react";
import {
  Apple,
  Beef,
  Wheat,
  Droplets,
  HeartPulse,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Nutrition() {
  const navigate = useNavigate();

  const [age, setAge] = useState(20);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState("Moderate");

  const [recommendation, setRecommendation] = useState("");
  const [healthGoal, setHealthGoal] = useState("");

  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState(false);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [nutritionResponse, profileResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/nutrition", {
              headers,
            }),
            fetch("http://localhost:5000/api/student/profile", {
              headers,
            }),
          ]);

        const nutritionData = await nutritionResponse.json();
        const profileData = await profileResponse.json();

        if (!nutritionResponse.ok) {
          alert(
            nutritionData.message ||
              "Failed to load nutrition information."
          );
          return;
        }

        if (!profileResponse.ok) {
          alert(
            profileData.message ||
              "Failed to load profile information."
          );
          return;
        }

        setNutrition(nutritionData.nutrition || []);
        setHealthGoal(
          profileData.student?.healthGoal ||
            "Maintain Weight"
        );
      } catch (error) {
        console.error("Nutrition fetch error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [navigate]);

  const generateRecommendation = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setRecommendationLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/nutrition/recommendation",
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
          data.message ||
            "Failed to generate recommendation."
        );
        return;
      }

      setRecommendation(data.recommendation || "");
      setHealthGoal(data.healthGoal || healthGoal);
    } catch (error) {
      console.error(
        "Recommendation fetch error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setRecommendationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">WELLNESS</p>
            <h1>Health & Nutrition</h1>
            <p className="page-description">
              Understand the nutritional value of your meals.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading nutrition information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">WELLNESS</p>
          <h1>Health & Nutrition</h1>
          <p className="page-description">
            Understand the nutritional value of your meals.
          </p>
        </div>
      </div>

      <div className="nutrition-layout">
        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <HeartPulse size={21} />
            </div>

            <div>
              <h3>Your Health Information</h3>
              <p>
                Used to generate a basic project
                recommendation.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Age</label>

              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Weight (kg)</label>

              <input
                type="number"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>Activity Level</label>

            <select
              value={activity}
              onChange={(e) =>
                setActivity(e.target.value)
              }
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

          <div className="input-group">
            <label>Saved Health Goal</label>

            <input
              value={healthGoal}
              disabled
            />
          </div>

          <button
            className="primary-button"
            onClick={generateRecommendation}
            disabled={recommendationLoading}
          >
            {recommendationLoading
              ? "Generating..."
              : "Generate Recommendation"}
          </button>
        </div>

        <div className="recommendation-card">
          <div className="recommendation-icon">
            <Apple size={25} />
          </div>

          <p className="eyebrow light">
            SMART RECOMMENDATION
          </p>

          <h3>Personalized Nutrition</h3>

          <p>
            {recommendation ||
              `Your backend recommendation will be based on your saved health goal: ${healthGoal}.`}
          </p>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">MEAL NUTRITION</p>
            <h3>Available Meal Nutrition</h3>
          </div>
        </div>

        {nutrition.length === 0 ? (
          <p>No nutrition information available.</p>
        ) : (
          <div className="nutrient-grid">
            {nutrition.map((meal) => (
              <div
                className="nutrient-card"
                key={meal._id}
              >
                <div className="nutrient-icon icon-orange">
                  <Flame size={20} />
                </div>

                <h4>{meal.mealName}</h4>

                <p>
                  {meal.mealType} •{" "}
                  {meal.calories || 0} kcal
                </p>

                <p>
                  {meal.nutritionInfo ||
                    "Nutrition information not available."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">NUTRITION BASICS</p>
            <h3>Key Nutrients</h3>
          </div>
        </div>

        <div className="nutrient-grid">
          <div className="nutrient-card">
            <div className="nutrient-icon icon-blue">
              <Beef size={20} />
            </div>

            <h4>Protein</h4>
            <p>
              Supports growth and tissue maintenance.
            </p>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon icon-orange">
              <Wheat size={20} />
            </div>

            <h4>Carbohydrates</h4>
            <p>
              Provide energy for daily activities.
            </p>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon icon-purple">
              <Droplets size={20} />
            </div>

            <h4>Healthy Fats</h4>
            <p>
              Support normal body functions and energy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nutrition;