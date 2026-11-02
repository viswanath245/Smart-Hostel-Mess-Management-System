const express = require("express");

const {
  createStaffMenuItem,
  getStaffMenu,
  updateStaffMenuItem,
  deleteStaffMenuItem
} = require("../controllers/staffMenuController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, createStaffMenuItem);
router.get("/", protectStaff, getStaffMenu);
router.put("/:id", protectStaff, updateStaffMenuItem);
router.delete("/:id", protectStaff, deleteStaffMenuItem);

module.exports = router;