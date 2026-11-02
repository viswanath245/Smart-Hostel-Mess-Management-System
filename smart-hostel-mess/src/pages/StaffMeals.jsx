import { useEffect, useState } from "react";
import {
  Utensils,
  Plus,
  Save,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function StaffMeals() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    mealName: "",
    mealType: "Breakfast",
    mealDate: "",
    calories: "",
    nutritionInfo: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        navigate("/staff/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/staff/meals",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load meals.");
        return;
      }

      setMeals(data.meals || []);
    } catch (error) {
      console.error("Staff meals fetch error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      mealName: "",
      mealType: "Breakfast",
      mealDate: "",
      calories: "",
      nutritionInfo: "",
    });

    setEditingId(null);
  };

  const submitMeal = async (e) => {
    e.preventDefault();

    if (!form.mealName || !form.mealType || !form.mealDate) {
      alert("Meal name, meal type and meal date are required.");
      return;
    }

    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        navigate("/staff/login");
        return;
      }

      setSaving(true);

      const url = editingId
        ? `http://localhost:5000/api/staff/meals/${editingId}`
        : "http://localhost:5000/api/staff/meals";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealName: form.mealName,
          mealType: form.mealType,
          mealDate: form.mealDate,
          calories:
            form.calories === "" ? undefined : Number(form.calories),
          nutritionInfo: form.nutritionInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save meal.");
        return;
      }

      alert(
        editingId
          ? "Meal updated successfully."
          : "Meal created successfully."
      );

      resetForm();
      await fetchMeals();
    } catch (error) {
      console.error("Staff meal save error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (meal) => {
    const date = meal.mealDate
      ? new Date(meal.mealDate).toISOString().split("T")[0]
      : "";

    setEditingId(meal._id);

    setForm({
      mealName: meal.mealName || "",
      mealType: meal.mealType || "Breakfast",
      mealDate: date,
      calories:
        meal.calories !== undefined && meal.calories !== null
          ? meal.calories
          : "",
      nutritionInfo: meal.nutritionInfo || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updatePreparationStatus = async (mealId, status) => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        navigate("/staff/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/staff/meals/${mealId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preparationStatus: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to update preparation status."
        );
        return;
      }

      setMeals((current) =>
        current.map((meal) =>
          meal._id === mealId ? data.meal : meal
        )
      );
    } catch (error) {
      console.error(
        "Preparation status update error:",
        error
      );

      alert("Unable to connect to the server.");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <Link to="/staff" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="topbar">
          <div>
            <p className="eyebrow">STAFF MANAGEMENT</p>
            <h1>Manage Meals</h1>
            <p className="page-description">
              Create and manage mess meals.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/staff" className="back-link">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="topbar">
        <div>
          <p className="eyebrow">STAFF MANAGEMENT</p>
          <h1>Manage Meals</h1>
          <p className="page-description">
            Create and manage mess meals.
          </p>
        </div>

        <button className="secondary-button" onClick={fetchMeals}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div className="card-heading-icon">
            {editingId ? <Save size={21} /> : <Plus size={21} />}
          </div>

          <div>
            <h3>
              {editingId ? "Update Meal" : "Create Meal"}
            </h3>

            <p>
              {editingId
                ? "Update the selected meal details."
                : "Add a new meal to the mess schedule."}
            </p>
          </div>
        </div>

        <form onSubmit={submitMeal}>
          <div className="form-grid">
            <div className="input-group">
              <label>Meal Name</label>

              <input
                value={form.mealName}
                onChange={(e) =>
                  updateForm("mealName", e.target.value)
                }
                placeholder="Enter Meal Name"
              />
            </div>

            <div className="input-group">
              <label>Meal Type</label>

              <select
                value={form.mealType}
                onChange={(e) =>
                  updateForm("mealType", e.target.value)
                }
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>

            <div className="input-group">
              <label>Meal Date</label>

              <input
                type="date"
                value={form.mealDate}
                onChange={(e) =>
                  updateForm("mealDate", e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Calories</label>

              <input
                type="number"
                min="0"
                value={form.calories}
                onChange={(e) =>
                  updateForm("calories", e.target.value)
                }
                placeholder="Enter Calories"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Nutrition Information</label>

            <textarea
              value={form.nutritionInfo}
              onChange={(e) =>
                updateForm("nutritionInfo", e.target.value)
              }
              placeholder="Enter Nutrition Information"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Meal"
                : "Create Meal"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">MEAL DATABASE</p>
            <h3>Existing Meals</h3>
          </div>

          <span className="records-count">
            {meals.length} meals
          </span>
        </div>

        {meals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Utensils size={28} />
            </div>

            <h3>No meals found</h3>

            <p>
              Create your first meal using the form above.
            </p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Calories</th>
                  <th>Preparation</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {meals.map((meal) => (
                  <tr key={meal._id}>
                    <td>
                      <strong>{meal.mealName}</strong>
                    </td>

                    <td>{meal.mealType}</td>

                    <td>{formatDate(meal.mealDate)}</td>

                    <td>{meal.calories || 0} kcal</td>

                    <td>
                      <select
                        value={
                          meal.preparationStatus || "Planned"
                        }
                        onChange={(e) =>
                          updatePreparationStatus(
                            meal._id,
                            e.target.value
                          )
                        }
                      >
                        <option>Planned</option>
                        <option>Preparing</option>
                        <option>Ready</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() => startEdit(meal)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffMeals;