import { useEffect, useState } from "react";
import {
  CalendarCheck,
  RefreshCw,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function StaffAttendance() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [meals, setMeals] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    mealId: "",
    status: "Present",
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

      const [
        studentsResponse,
        mealsResponse,
        attendanceResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:5000/api/staff/students",
          { headers }
        ),
        fetch(
          "http://localhost:5000/api/staff/meals",
          { headers }
        ),
        fetch(
          "http://localhost:5000/api/staff/attendance",
          { headers }
        ),
      ]);

      const studentsData =
        await studentsResponse.json();

      const mealsData =
        await mealsResponse.json();

      const attendanceData =
        await attendanceResponse.json();

      if (!studentsResponse.ok) {
        alert(
          studentsData.message ||
            "Failed to load students."
        );
        return;
      }

      if (!mealsResponse.ok) {
        alert(
          mealsData.message ||
            "Failed to load meals."
        );
        return;
      }

      if (!attendanceResponse.ok) {
        alert(
          attendanceData.message ||
            "Failed to load attendance."
        );
        return;
      }

      setStudents(
        studentsData.students || []
      );

      setMeals(mealsData.meals || []);

      setAttendance(
        attendanceData.attendance || []
      );
    } catch (error) {
      console.error(
        "Staff attendance fetch error:",
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

  const recordAttendance = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.mealId) {
      alert(
        "Please select a student and a meal."
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
        "http://localhost:5000/api/staff/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to record attendance."
        );
        return;
      }

      alert(
        "Attendance recorded successfully."
      );

      setForm({
        studentId: "",
        mealId: "",
        status: "Present",
      });

      await fetchData();
    } catch (error) {
      console.error(
        "Attendance recording error:",
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
            <h1>Attendance</h1>
            <p className="page-description">
              Record and monitor student meal attendance.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading attendance...</p>
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
          <h1>Attendance</h1>
          <p className="page-description">
            Record and monitor student meal attendance.
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
            <CalendarCheck size={21} />
          </div>

          <div>
            <h3>Record Attendance</h3>
            <p>
              Select a student, meal and attendance status.
            </p>
          </div>
        </div>

        <form onSubmit={recordAttendance}>
          <div className="form-grid">
            <div className="input-group">
              <label>Student</label>

              <select
                value={form.studentId}
                onChange={(e) =>
                  updateForm(
                    "studentId",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select a student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.studentId} -{" "}
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

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
              <label>Status</label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateForm(
                    "status",
                    e.target.value
                  )
                }
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Missed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Recording..."
              : "Record Attendance"}
          </button>
        </form>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              ATTENDANCE DATABASE
            </p>
            <h3>Attendance Records</h3>
          </div>

          <span className="records-count">
            {attendance.length} records
          </span>
        </div>

        {attendance.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={28} />
            </div>

            <h3>No attendance records</h3>

            <p>
              Attendance records will appear here.
            </p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Meal</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.studentId?.studentId ||
                        "Unknown"}
                      {" - "}
                      {item.studentId?.name ||
                        "Student"}
                    </td>

                    <td>
                      {item.mealId?.mealType ||
                        "Meal"}
                      {" - "}
                      {item.mealId?.mealName ||
                        "Unknown"}
                    </td>

                    <td>
                      {formatDate(
                        item.attendanceTime
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Present"
                            ? "status-success"
                            : "status-danger"
                        }`}
                      >
                        {item.status}
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

export default StaffAttendance;