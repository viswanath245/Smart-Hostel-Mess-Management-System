const express = require("express");

const {
  createVote,
  getMyVotes
} = require("../controllers/voteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createVote);
router.get("/my", protect, getMyVotes);

module.exports = router;