const Plan = require("../models/PlanModel");
const Exercise = require("../models/ExerciseModel");
const User = require("../models/UserModel");
const Attendance = require ("../models/AttendanceModel")

exports.markAttendance = async (req, res, next) => {
    const { userRefs, planRefs } = req.body;

    try {
        // Check if attendance record already exists for the user and date
        const existingAttendance = await Attendance.findOne({ userRefs, planRefs, date: { $gte: new Date(new Date().setHours(0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59)) } });

        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked for today" });
        }

        // Create new attendance record
        const attendance = new Attendance({
            userRefs,
            planRefs,
            date: new Date(),
            marked: true
        });

        await attendance.save();

        // Update user document to include reference to attendance record
        await User.findByIdAndUpdate(userRefs, planRefs, { $push: { attendanceRefs: attendance._id } });

        return res.status(200).json({ message: "Attendance marked successfully" });

        
    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Endpoint to get the attendance register
exports.attendanceRegister = async (req, res) => {
    try {
        const attendanceRegister = await Attendance.find().populate('userRefs planRefs');

        return res.status(200).json(attendanceRegister);
    } catch (error) {
        console.error("Error fetching attendance register:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
  