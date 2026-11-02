const express = require("express");

const {
  recordCrowd,
  getCrowdRecords
} = require("../controllers/crowdController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, recordCrowd);
router.get("/", protectStaff, getCrowdRecords);

module.exports = router;