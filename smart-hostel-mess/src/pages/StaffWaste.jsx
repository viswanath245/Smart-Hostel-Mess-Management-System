import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";

function StaffWaste() {
  const [meals, setMeals] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    mealId: "",
    date: "2026-09-13",
    foodPrepared: "",
    foodWasted: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("staffToken");

  const loadData = async () => {
    try {
      const [mealsRes, wasteRes] = await Promise.all([
        fetch("http://localhost:5000/api/staff/meals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5000/api/staff/waste", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

    const mealsData = await mealsRes.json();
    const wasteData = await wasteRes.json();

    setMeals(
    Array.isArray(mealsData)
        ? mealsData
        : mealsData.meals || mealsData.data || []
    );

    setRecords(
    Array.isArray(wasteData)
        ? wasteData
        : wasteData.wasteRecords || []
    );
    } catch (error) {
      setMessage("Failed to load food waste data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const prepared = Number(form.foodPrepared) || 0;
  const wasted = Number(form.foodWasted) || 0;

  const wastePercentage =
    prepared > 0 ? ((wasted / prepared) * 100).toFixed(2) : "0.00";

  const getWasteLevel = (percentage) => {
    if (percentage < 5) return "Low";
    if (percentage < 15) return "Normal";
    return "High";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.mealId || !form.date || prepared <= 0 || wasted < 0) {
      setMessage("Please enter valid food waste details.");
      return;
    }

    if (wasted > prepared) {
      setMessage("Food wasted cannot be greater than food prepared.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/staff/waste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealId: form.mealId,
          date: form.date,
          foodPrepared: prepared,
          foodWasted: wasted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save food waste record.");
        setLoading(false);
        return;
      }

      setMessage("Food waste record added successfully.");

      setForm({
        mealId: "",
        date: "2026-09-13",
        foodPrepared: "",
        foodWasted: "",
      });

      await loadData();
    } catch (error) {
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/staff" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1>
            <Trash2 size={28} />
            Food Waste Analysis
          </h1>

          <p>Record and monitor food waste for each meal.</p>
        </div>

        <button className="refresh-btn" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="form-card">
        <h2>Add Food Waste Record</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meal</label>

            <select
              name="mealId"
              value={form.mealId}
              onChange={handleChange}
              required
            >
              <option value="">Select Meal</option>

              {meals.map((meal) => (
                <option key={meal._id} value={meal._id}>
                  {meal.mealName} - {meal.mealType} -{" "}
                  {new Date(meal.mealDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Food Prepared</label>
              <input
                type="number"
                name="foodPrepared"
                min="0"
                step="0.01"
                placeholder="Enter quantity"
                value={form.foodPrepared}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Food Wasted</label>
              <input
                type="number"
                name="foodWasted"
                min="0"
                step="0.01"
                placeholder="Enter quantity"
                value={form.foodWasted}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="waste-preview">
            <div>
              <span>Waste Percentage</span>
              <strong>{wastePercentage}%</strong>
            </div>

            <div>
              <span>Waste Level</span>
              <strong>{getWasteLevel(Number(wastePercentage))}</strong>
            </div>
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Waste Record"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Food Waste Records</h2>
          <span>{records.length} Records</span>
        </div>

        {records.length === 0 ? (
          <div className="empty-state">
            No food waste records available.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Date</th>
                  <th>Prepared</th>
                  <th>Wasted</th>
                  <th>Waste %</th>
                  <th>Level</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => {
                  const percentage = Number(record.wastePercentage || 0);
                  const level = getWasteLevel(percentage);

                  return (
                    <tr key={record._id}>
                      <td>
                        {record.mealId?.mealName || "Unknown Meal"}
                      </td>

                      <td>
                        {record.date
                          ? new Date(record.date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>{record.foodPrepared}</td>
                      <td>{record.foodWasted}</td>
                      <td>{percentage.toFixed(2)}%</td>

                      <td>
                        <span className={`status-badge ${level.toLowerCase()}`}>
                          {level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffWaste;