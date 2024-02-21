const Team = require("../models/TeamModel");
const User = require("../models/UserModel");
const Club = require("../models/ClubModel");
const Attendance = require("../models/AttendanceModel");
const Plan = require("../models/PlanModel");

const { default: mongoose } = require("mongoose");


exports.createTeam = async (req, res, next) => {
  let { teamName, teamCategory, trainerRefs, playerRefs, clubRefs, planRefs, attendanceRefs } = req.body

  try {
    // Ensure userRefs is an array
    clubRefs = Array.isArray(clubRefs) ? clubRefs : [clubRefs];
    trainerRefs = Array.isArray(trainerRefs) ? trainerRefs : [trainerRefs];
    playerRefs = Array.isArray(playerRefs) ? playerRefs : [playerRefs];
    planRefs = Array.isArray(planRefs) ? planRefs : [planRefs];
    attendanceRefs = Array.isArray(attendanceRefs) ? attendanceRefs : [attendanceRefs];
    // Check if the user making the request is a trainer
    if (req.user && req.user.role.toLowerCase() !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create teams.' });
    }
    // Check if teamName is provided
    if (!teamName) {
      return res.status(400).json({ message: 'Team name is required.' });
    }
    // Check if team with the same name already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team with the same name already exists.' });
    }
    // Create a variable to check if the team already exists
    const teamExists = existingTeam !== null;

    const trainerName = req.user.username;
    const trainers = await User.find({ teamName, role: 'trainer' });
    const players = await User.find({ teamName, role: 'player' });
    
    trainerRefs = trainers.map(trainer => trainer._id);
    playerRefs = players.map(player => player._id);

    // Create a new team based on the request body
    const newTeam = new Team({
      teamName,
      teamCategory,
      trainerName: req.user.username,
      trainerRefs: req.user._id, 
      playerRefs, 
      clubRefs, 
      planRefs,
      attendanceRefs: attendanceRefs
    });

    // Save the new team to the database
    const savedTeam = await newTeam.save();
    // Update user documents to include reference to team record
    const updateUserPromises = [...trainerRefs, ...playerRefs].map(userId => User.findByIdAndUpdate(userId, { $push: { teamRefs: savedTeam._id } }, { new: true }));

    // Update club documents to include reference to team record
    const updateClubRefsPromises = clubRefs.map(clubId => Club.findByIdAndUpdate(clubId, { $push: { teamRefs: savedTeam._id } }, { new: true }));
/*
    // Update plan document to include reference to team record
    //const updatePlanPromises = planRefs.map(planId => Plan.findByIdAndUpdate(planId, { $push: { teamRefs: savedTeam._id } }, { new: true }));
*/
    // Update plan document to include reference to attendance record
    const updateAttendancePromises = attendanceRefs.map(attendanceId => Attendance.findByIdAndUpdate(attendanceId, { $push: { teamRefs: savedTeam._id } }, { new: true }));

    await Promise.all([...updateUserPromises, ...updateClubRefsPromises, ...updateAttendancePromises]);
    // Respond with the newly created team
    res.status(200).json({ team: savedTeam, teamExists: teamExists });

    next();
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error status
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  };
};

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();
    console.log({ message: "teams get succesfully", team: teams });
    res.status(200).json(teams);
    next();
  } catch (error) {
    console.error("Error getting team", error);
    res.status(500).json({ error: "error while getting a team" });
  } next(error);
};


exports.getSpecificTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    console.log({ message: "team get succesfully", team: team });
    res.status(200).json(team);
    next();
  } catch (error) {
    console.error("Error getting team", error);
    res.status(500).json({ error: "error while getting a team" });
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const { equipoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(equipoId)) {
      return res.status(400).json({ error: 'Invalid team ID: {equipoId}.' });
    }
    const updateData = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(equipoId, updateData, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found." });
    }
    console.log({ message: "Team updated successfully.", teamUpdated: updatedTeam })
    res.status(200).json(updatedTeam);
    next();
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "An error occurred while updating the team." });
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const { equipoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(equipoId)) {
      res.status(400).json({ message: 'Specified team id is not valid: {equipoId}' });
      return;
    }
      const deletedTeam = await Team.findByIdAndDelete(equipoId);
      if (!deletedTeam) {
        return res.status(404).json({ error: "Team not found." });
      }

      res.status(200).json({ message: "Team deleted successfully." });
      next();
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ error: "An error occurred while deleting the team." });
    }
  };
