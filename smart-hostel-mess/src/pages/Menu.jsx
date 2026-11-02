import {
  Flame,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [mealsResponse, menuResponse] = await Promise.all([
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
          alert(mealsData.message || "Failed to load meals.");
          return;
        }

        if (!menuResponse.ok) {
          alert(menuData.message || "Failed to load menu.");
          return;
        }

        setMeals(mealsData.meals || []);
        setMenu(menuData.menu || []);
      } catch (error) {
        console.error("Menu fetch error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [navigate]);

  const getMenuItems = (mealId) => {
    return menu
      .filter((item) => {
        return item.mealId && item.mealId._id === mealId;
      })
      .map((item) => item.foodItem);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">MESS MENU</p>
            <h1>Food Menu</h1>
            <p className="page-description">
              Explore your daily meals and nutritional information.
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
      <div className="topbar">
        <div>
          <p className="eyebrow">MESS MENU</p>
          <h1>Food Menu</h1>
          <p className="page-description">
            Explore your daily meals and nutritional information.
          </p>
        </div>

        <div className="date-pill">
          <CalendarDays size={17} />
          September 2026
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="content-card">
          <p>No meals are currently available.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {meals.map((meal) => {
            const items = getMenuItems(meal._id);

            return (
              <div
                className="modern-meal-card"
                key={meal._id}
              >
                <div className="meal-card-header">
                  <div>
                    <span className="meal-label">
                      {meal.mealType}
                    </span>

                    <h2>{meal.mealName}</h2>
                  </div>

                  <div className="meal-icon">
                    <Flame size={20} />
                  </div>
                </div>

                <div className="meal-date">
                  {formatDate(meal.mealDate)}
                </div>

                <div className="food-items">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <span key={item}>{item}</span>
                    ))
                  ) : (
                    <span>Menu items not available</span>
                  )}
                </div>

                <div className="nutrition-row">
                  <div>
                    <Flame size={15} />
                    <span>{meal.calories || 0} kcal</span>
                  </div>

                  <div>
                    <span>
                      {meal.nutritionInfo ||
                        "Nutrition information not available"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;