import { useEffect, useState } from "react";
import {
  Users,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function StaffCrowd() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    mealId: "",
    date: "",
    studentCount: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        navigate("/staff/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [mealsResponse, crowdResponse] =
        await Promise.all([
          fetch(
            "http://localhost:5000/api/staff/meals",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/staff/crowd",
            { headers }
          ),
        ]);

      const mealsData = await mealsResponse.json();
      const crowdData = await crowdResponse.json();

      if (!mealsResponse.ok) {
        alert(
          mealsData.message ||
            "Failed to load meals."
        );
        return;
      }

      if (!crowdResponse.ok) {
        alert(
          crowdData.message ||
            "Failed to load crowd records."
        );
        return;
      }

      setMeals(mealsData.meals || []);
      setRecords(crowdData.crowdRecords || []);
    } catch (error) {
      console.error(
        "Crowd data fetch error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitCrowd = async (e) => {
    e.preventDefault();

    if (
      !form.mealId ||
      !form.date ||
      form.studentCount === ""
    ) {
      alert(
        "Meal, date and student count are required."
      );
      return;
    }

    if (Number(form.studentCount) < 0) {
      alert(
        "Student count cannot be negative."
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("staffToken");

      if (!token) {
        navigate("/staff/login");
        return;
      }

      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/staff/crowd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: form.mealId,
            date: form.date,
            studentCount: Number(
              form.studentCount
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to record crowd data."
        );
        return;
      }

      alert(
        "Crowd data recorded successfully."
      );

      setForm({
        mealId: "",
        date: "",
        studentCount: "",
      });

      await fetchData();
    } catch (error) {
      console.error(
        "Crowd submission error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(
      dateValue
    ).toLocaleDateString("en-IN", {
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
            <p className="eyebrow">
              STAFF OPERATIONS
            </p>

            <h1>Crowd Monitoring</h1>

            <p className="page-description">
              Monitor meal crowd levels and student
              counts.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading crowd data...</p>
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
          <p className="eyebrow">
            STAFF OPERATIONS
          </p>

          <h1>Crowd Monitoring</h1>

          <p className="page-description">
            Monitor meal crowd levels and student
            counts.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={fetchData}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div className="card-heading-icon">
            <Users size={21} />
          </div>

          <div>
            <h3>Record Crowd Data</h3>

            <p>
              Enter the number of students served
              for a meal.
            </p>
          </div>
        </div>

        <form onSubmit={submitCrowd}>
          <div className="form-grid">
            <div className="input-group">
              <label>Meal</label>

              <select
                value={form.mealId}
                onChange={(e) =>
                  updateForm(
                    "mealId",
                    e.target.value
                  )
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
                    {meal.mealType} -{" "}
                    {meal.mealName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  updateForm(
                    "date",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Student Count</label>

              <input
                type="number"
                min="0"
                value={form.studentCount}
                onChange={(e) =>
                  updateForm(
                    "studentCount",
                    e.target.value
                  )
                }
                placeholder="Enter Student Count"
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Recording..."
              : "Record Crowd Data"}
          </button>
        </form>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              CROWD DATABASE
            </p>

            <h3>Crowd Records</h3>
          </div>

          <span className="records-count">
            {records.length} records
          </span>
        </div>

        {records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={28} />
            </div>

            <h3>No crowd records</h3>

            <p>
              Crowd records will appear here.
            </p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Date</th>
                  <th>Students</th>
                  <th>Crowd Level</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>
                      {record.mealId?.mealType ||
                        "Meal"}
                      {" - "}
                      {record.mealId?.mealName ||
                        "Unknown"}
                    </td>

                    <td>
                      {formatDate(record.date)}
                    </td>

                    <td>
                      {record.studentCount}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          record.crowdLevel === "Low"
                            ? "status-success"
                            : record.crowdLevel ===
                              "Normal"
                            ? "neutral-badge"
                            : "status-danger"
                        }`}
                      >
                        {record.crowdLevel}
                      </span>
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

export default StaffCrowd;