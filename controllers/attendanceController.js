const Plan = require("../models/PlanModel");
const Exercise = require("../models/ExerciseModel");
const User = require("../models/UserModel");
const Attendance = require ("../models/AttendanceModel")

exports.markAttendance = async (req, res, next) => {
    let { userRefs, planRefs } = req.body;

    try {
        // Ensure userRefs is an array
        userRefs = Array.isArray(userRefs) ? userRefs : [userRefs];
        planRefs = Array.isArray(planRefs) ? planRefs : [planRefs];


          // Check if attendance record already exists for the user and plan on the current date
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59));
        // Check if attendance record already exists for the user and date
        const existingAttendance = await Attendance.findOne({ userRefs: { $in: userRefs }, planRefs, date: { $gte: new Date(new Date().setHours(0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59)) } });

        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked for today" });
        }

        // Create new attendance record
        const attendance = new Attendance({
            userRefs: userRefs,
            planRefs: planRefs,
            date: new Date(),
            marked: true
        });

        await attendance.save();

        // Update user documents to include reference to attendance record
        const updateUserPromises = userRefs.map(userId => User.findByIdAndUpdate(userId, { $push: { attendanceRefs: attendance._id }, $addToSet: { planRefs: planRefs }}));

        // Update plan document to include reference to attendance record
        const updatePlanPromises = planRefs.map(planId => Plan.findByIdAndUpdate(planId, { $push: { attendanceRefs: attendance._id }, $addToSet: { userRefs: { $each: userRefs } } }));

        await Promise.all([...updateUserPromises, updatePlanPromises]);

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
  