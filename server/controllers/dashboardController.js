import Consultation from "../models/Consultation.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalConsultations = await Consultation.countDocuments();

    // Today's consultations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayConsultations = await Consultation.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // Recent consultations (last 8)
    const recentConsultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("student", "name matricNumber")
      .lean();

    // Common predicted diseases (top 5)
    const diseaseStats = await Consultation.aggregate([
      { $match: { predictedDisease: { $exists: true, $ne: null } } },
      { $group: { _id: "$predictedDisease", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalStudents,
      totalConsultations,
      todayConsultations,
      recentConsultations,
      diseaseStats,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};