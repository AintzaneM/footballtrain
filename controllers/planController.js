const Plan = require("../models/PlanModel");
const Club = require("../models/ClubModel");
const User = require("../models/UserModel");
const Team = require("../models/TeamModel");
const Attendance = require("../models/AttendanceModel");
const { default: mongoose } = require("mongoose");


//es necesario al crear el entrenamiento userRef, attendanceRefs, teamRefs, no será hasta que exista en la base de datos y se haya creado que contendrá un usuario, un team etc...!!
exports.createPlan = async (req, res, next) => {
  let {
    planName,
    planDescription,
    dateStart,
    dateEnd,
    progress,
    trainerName,
    clubRefs,
    trainerRefs,
    playerRefs,
    attendanceRefs,
    teamRefs
  } = req.body;

  console.log(req.body)
  try {
    clubRefs = Array.isArray(clubRefs) ? clubRefs : [clubRefs];
    trainerRefs = Array.isArray(trainerRefs) ? trainerRefs : [trainerRefs];
    playerRefs = Array.isArray(playerRefs) ? playerRefs : [playerRefs];
    attendanceRefs = Array.isArray(attendanceRefs) ? attendanceRefs : [attendanceRefs];
    teamRefs = Array.isArray(teamRefs) ? teamRefs : [teamRefs];

    if (req.user && req.user.role.toLowerCase() !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create plans.' });
    }
    // Check if planName is provided
    if (!planName) {
      return res.status(400).json({ message: 'Plan name is required.' });
    }
    const existingPlan = await Plan.findOne({ planName });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with the same name already exists.' });
    }

    // Create a variable to check if the plan already exists
    const planExists = existingPlan !== null;
    // Assume trainerName from req.user.username
    const trainerName = req.user.username;
    const trainers = await User.find({ planName, role: 'trainer' });
    const players = await User.find({ planName, role: 'player' });

    trainerRefs = trainers.map(trainer => trainer._id);
    playerRefs = players.map(player => player._id);

    const newPlan = new Plan({
      planName,
      planDescription,
      dateStart,
      dateEnd,
      progress,
      trainerName: req.user.username,
      clubRefs,
      trainerRefs: trainerRefs,
      playerRefs: playerRefs,
      attendanceRefs: attendanceRefs,
      teamRefs
    });

    const plan = await newPlan.save();
    console.log({ message: "plan saved", plan });

    // Update user documents to include reference to plan record
    const updateUserPromises = [...trainerRefs, ...playerRefs].map(userId => User.findByIdAndUpdate(userId, { $push: { planRefs: plan._id } }, { new: true }));
    // Update club documents to include reference to team record
    const updateClubRefsPromises = clubRefs.map(clubId => Club.findByIdAndUpdate(clubId, { $push: { clubRefs: plan._id } }, { new: true }));

    // Update team document to include reference to plan record
    const updateTeamPromises = teamRefs.map(teamId => Team.findByIdAndUpdate(teamId, { $push: { planRefs: plan._id } }));
    // Update attendance document to include reference to plan record
    const updateAttendancePromises = attendanceRefs.map(attendanceId => Attendance.findByIdAndUpdate(attendanceId, { $push: { planRefs: plan._id } }));

    await Promise.all([...updateUserPromises, ...updateClubRefsPromises, ...updateTeamPromises, ...updateAttendancePromises]);

    res.status(200).json({ plan: plan, planExists: planExists });
    console.log({ message: "plan saved and updated", plan });
    next();
  } catch (error) {
    console.error("Error creating plan", error);
    res.status(500).json({ error: "error while saving a new plan" });
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find();
    console.log({ message: "plans get succesfully", plan: plans });
    res.status(200).json(plans);
    next();
  } catch (error) {
    console.error("Error getting plans", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};


exports.getSpecificPlan = async (req, res, next) => {
  try {
    const { entrenamientoId } = req.params;
    const plan = await Plan.findById(entrenamientoId);
    console.log({ message: "plan get succesfully", plan: plan });
    res.status(200).json(plan);
    next();
  } catch (error) {
    console.error("Error getting plan", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const { entrenamientoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(entrenamientoId)) {
      res.status(400).json({ message: 'Specified team id is not valid: {entrenamientoId}' });
      return;
    }
    const updateData = req.body;
    const updatedPlan = await Plan.findByIdAndUpdate(entrenamientoId, updateData, {
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
    next();
  } catch (error) {
    console.error("Error updating plan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the plan." });
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const { entrenamientoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(entrenamientoId)) {
      res.status(400).json({ message: 'Specified team id is not valid: {entrenamientoId}' });
      return;
    }
    const deletedPlan = await Plan.findByIdAndDelete(entrenamientoId);
    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    res.status(200).json({ message: "Plan deleted successfully." });
    next
  } catch (error) {
    console.error("Error deleting plan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the plan." });
  }
};
