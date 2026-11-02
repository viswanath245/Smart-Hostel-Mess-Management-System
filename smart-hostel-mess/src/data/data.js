export const student = {
  studentId: "STU001",
  name: "Demo Student",
  email: "student@example.com",
  phone: "9876543210",
  hostelBlock: "A Block",
  health: {
    age: 20,
    weight: 65,
    activityLevel: "Moderate"
  }
};

export const meals = [
  {
    id: 1,
    name: "Breakfast",
    type: "Breakfast",
    date: "2026-09-01",
    items: ["Idli", "Sambar", "Chutney", "Banana"],
    calories: 450,
    protein: 12,
    carbs: 70,
    fat: 10
  },
  {
    id: 2,
    name: "Lunch",
    type: "Lunch",
    date: "2026-09-01",
    items: ["Rice", "Dal", "Vegetable Curry", "Curd"],
    calories: 650,
    protein: 20,
    carbs: 95,
    fat: 18
  },
  {
    id: 3,
    name: "Dinner",
    type: "Dinner",
    date: "2026-09-01",
    items: ["Chapati", "Paneer Curry", "Dal", "Salad"],
    calories: 600,
    protein: 25,
    carbs: 70,
    fat: 20
  },
  {
    id: 4,
    name: "Breakfast",
    type: "Breakfast",
    date: "2026-09-02",
    items: ["Dosa", "Sambar", "Chutney", "Milk"],
    calories: 500,
    protein: 15,
    carbs: 72,
    fat: 14
  }
];

export const notifications = [
  {
    id: 1,
    title: "Menu Updated",
    message: "Tomorrow's dinner menu has been updated.",
    date: "2026-08-31"
  },
  {
    id: 2,
    title: "Meal Booking Reminder",
    message: "Remember to book your meals on time.",
    date: "2026-08-31"
  }
];

export const attendance = [
  {
    id: 1,
    date: "2026-08-28",
    meal: "Breakfast",
    status: "Present"
  },
  {
    id: 2,
    date: "2026-08-28",
    meal: "Lunch",
    status: "Present"
  },
  {
    id: 3,
    date: "2026-08-28",
    meal: "Dinner",
    status: "Absent"
  },
  {
    id: 4,
    date: "2026-08-29",
    meal: "Breakfast",
    status: "Present"
  }
];

export const menuVotes = [
  "Paneer Biryani",
  "Chicken Biryani",
  "Veg Fried Rice",
  "Masala Dosa"
];