const Complaint = require("../models/Complaint");

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "studentId name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Complaints retrieved successfully",
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      message: "Server error while retrieving complaints.",
    });
  }
};

// Get one complaint
exports.getComplaintById = async (req, res) => {
  try {
    const complaintId = req.params.id.trim();

    const complaint = await Complaint.findById(complaintId).populate(
      "studentId",
      "studentId name email"
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      message: "Complaint retrieved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    res.status(500).json({
      message: "Server error while retrieving complaint.",
    });
  }
};

// Update complaint status
exports.updateComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id.trim();

    const { status } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    if (status !== undefined) {
      complaint.status = status;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(
      complaint._id
    ).populate("studentId", "studentId name email");

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      message: "Server error while updating complaint.",
    });
  }
};