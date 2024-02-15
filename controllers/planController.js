const Plan = require("../models/PlanModel");
const Exercise = require("../models/ExerciseModel");
const User = require("../models/UserModel");
const Team = require("../models/TeamModel");
const Attendance = require("../models/AttendanceModel");
const { default: mongoose } = require("mongoose");


//es necesario al crear el entrenamiento userRef, attendanceRefs, teamRefs, no será hasta que exista en la base de datos y se haya creado que contendrá un usuario, un team etc...!!
exports.createPlan = async (req, res, next) => {
  let {
    category,
    planTitle,
    planDescription,
    dateStart,
    dateEnd,
    progress,
    trainerName,
    //excerciseRefs,
    userRefs,
    attendanceRefs,
    teamRefs,
  } = req.body;
console.log(req.body)
  try {
    userRefs = Array.isArray(userRefs) ? userRefs : [userRefs];
    attendanceRefs = Array.isArray(attendanceRefs) ? attendanceRefs : [attendanceRefs];
    teamRefs = Array.isArray(teamRefs) ? teamRefs : [teamRefs];
   
     // Assume trainerName from req.user.username
     const trainerName = req.user.username;

    const newPlan = new Plan({
      category,
      planTitle,
      planDescription,
      dateStart,
      dateEnd,
      progress,
      //excerciseRefs: [],
      trainerName,
      userRefs: userRefs,
      attendanceRefs: attendanceRefs,
      teamRefs: teamRefs, 
    });

    const plan = await newPlan.save();
    console.log({ message: "plan saved", plan });

    // Update user documents to include reference to plan record
    const updateUserPromises = userRefs.map(userId => User.findByIdAndUpdate(userId, { $push: { planRefs: plan._id } }));

    // Update team document to include reference to plan record
    const updateTeamPromises = teamRefs.map(teamId => Team.findByIdAndUpdate(teamId, { $push: { planRefs: plan._id }}));
    // Update attendance document to include reference to plan record
    const updateAttendancePromises = attendanceRefs.map(attendanceId => Attendance.findByIdAndUpdate(attendanceId, { $push: { planRefs: plan._id }}));

    await Promise.all([updateUserPromises, updateTeamPromises, updateAttendancePromises]);

    res.status(200).json(plan);
    console.log({ message: "plan saved and updated", plan });

  } catch (error) {
    console.error("Error creating plan", error);
    res.status(500).json({ error: "error while saving a new plan" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    console.log({ message: "plans get succesfully", plans: plans });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error getting plans", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};


exports.getSpecificPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    console.log({ message: "plan get succesfully", plan: plan });
    res.status(200).json(plan);
  } catch (error) {
    console.error("Error getting plan", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }
    console.log({
      message: "Plan updated successfully.",
      planUpdated: updatedPlan,
    });
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error updating plan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the plan." });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};
