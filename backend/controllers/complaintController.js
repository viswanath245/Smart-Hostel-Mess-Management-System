const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        message: "Subject and description are required"
      });
    }

    const complaint = await Complaint.create({
      studentId: req.student._id,
      subject,
      description
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate("studentId", "studentId name email");

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: populatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint",
      error: error.message
    });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.student._id
    }).sort({ complaintDate: -1 });

    res.json({
      message: "Complaints retrieved successfully",
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve complaints",
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints
};