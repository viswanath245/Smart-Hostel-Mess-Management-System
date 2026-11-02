import { useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  Save,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function StaffMenu() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    mealId: "",
    foodItem: "",
    day: "",
  });

  const [editingId, setEditingId] = useState(null);

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

      const [mealsResponse, menuResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/staff/meals", {
            headers,
          }),
          fetch("http://localhost:5000/api/staff/menu", {
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
      setMenu(menuData.menu || []);
    } catch (error) {
      console.error(
        "Staff menu fetch error:",
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

  const resetForm = () => {
    setForm({
      mealId: "",
      foodItem: "",
      day: "",
    });

    setEditingId(null);
  };

  const submitMenuItem = async (e) => {
    e.preventDefault();

    if (
      !form.mealId ||
      !form.foodItem ||
      !form.day
    ) {
      alert(
        "Meal, food item and day are required."
      );
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
        ? `http://localhost:5000/api/staff/menu/${editingId}`
        : "http://localhost:5000/api/staff/menu";

      const method = editingId ? "PUT" : "POST";

      const body = {
        mealId: form.mealId,
        foodItem: form.foodItem,
        day: form.day,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save menu item."
        );
        return;
      }

      alert(
        editingId
          ? "Menu item updated successfully."
          : "Menu item created successfully."
      );

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(
        "Staff menu save error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);

    setForm({
      mealId: item.mealId?._id || "",
      foodItem: item.foodItem || "",
      day: item.day || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
              STAFF MANAGEMENT
            </p>

            <h1>Manage Menu</h1>

            <p className="page-description">
              Manage food items for each meal.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading menu...</p>
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
            STAFF MANAGEMENT
          </p>

          <h1>Manage Menu</h1>

          <p className="page-description">
            Manage food items for each meal.
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
            {editingId ? (
              <Save size={21} />
            ) : (
              <Plus size={21} />
            )}
          </div>

          <div>
            <h3>
              {editingId
                ? "Update Menu Item"
                : "Add Menu Item"}
            </h3>

            <p>
              Add food items to a meal.
            </p>
          </div>
        </div>

        <form onSubmit={submitMenuItem}>
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
              <label>Food Item</label>

              <input
                value={form.foodItem}
                onChange={(e) =>
                  updateForm(
                    "foodItem",
                    e.target.value
                  )
                }
                placeholder="Enter Food Item"
              />
            </div>

            <div className="input-group">
              <label>Day</label>

              <input
                value={form.day}
                onChange={(e) =>
                  updateForm(
                    "day",
                    e.target.value
                  )
                }
                placeholder="Enter Day"
              />
            </div>
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
                ? "Update Menu Item"
                : "Add Menu Item"}
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
            <p className="eyebrow">
              MENU DATABASE
            </p>

            <h3>Existing Menu Items</h3>
          </div>

          <span className="records-count">
            {menu.length} items
          </span>
        </div>

        {menu.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ClipboardList size={28} />
            </div>

            <h3>No menu items found</h3>

            <p>
              Add your first menu item using the
              form above.
            </p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Type</th>
                  <th>Food Item</th>
                  <th>Day</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {menu.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.mealId?.mealName ||
                        "Unknown Meal"}
                    </td>

                    <td>
                      {item.mealId?.mealType ||
                        "Unknown"}
                    </td>

                    <td>
                      <strong>
                        {item.foodItem}
                      </strong>
                    </td>

                    <td>{item.day}</td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          startEdit(item)
                        }
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

export default StaffMenu;