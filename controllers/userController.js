const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const Team = require("../models/TeamModel");
const { default: mongoose } = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log({ message: "users get succesfully", users: users });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users", error);
    res.status(500).json({ error: "error while getting a user" });
  }
};

exports.assignUserToPlan = async (req, res, next) => {
  try {
    const { userId, entrenamientoId } = req.params;

    // Validate user ID and plan ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(entrenamientoId)) {
      return res.status(400).json({ message: "Invalid user or plan ID." });
    }

    // Find user and plan
    const user = await User.findById(userId);
    const plan = await Plan.findById(entrenamientoId);

    // Check if user and plan exist
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found." });
    }
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Check if the user is already assigned to the plan
    if (plan.userRefs.includes(userId)) {
      return res.status(400).json({ message: "User is already assigned to the plan." });
    }

    // Assign user to the plan
    plan.userRefs.push(userId);
    await plan.save();

    return res.status(200).json({ message: "User assigned to plan successfully." });
  } catch (error) {
    console.error("Error assigning user to plan:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
};


exports.assignPlayersToTeam = async (req, res, next) => {
  const { playerRefs } = req.body;
  const equipoId = req.params.equipoId;
  await assignUsersToTeam(equipoId, playerRefs, req, res);
}
exports.assignTrainersToTeam = async (req, res, next) => {
  const { trainerRefs } = req.body;
  const equipoId = req.params.equipoId;
  
  await assignUsersToTeam(equipoId, trainerRefs, req, res);
};

async function assignUsersToTeam(equipoId, userIds, req, res) {

  const team = await Team.findById(equipoId);
  
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

 if(!req.user || req.user.role.toLowerCase() !== 'trainer') {
  return res.status(403).json({ message: "Only trainers can assign users to teams" });
  }

  // Check if the userIds array is provided and not empty
  if (!userIds || userIds.length === 0) {
    console.log("usersids",userIds)
    return res.status(400).json({ message: "Please provide user IDs to assign" });
  }
    // Filtrar los usuarios por su rol

  try{
    const users = await User.find({ _id: { $in: userIds } });
    const players = users.filter(user => user.role === 'player');
    const trainers = users.filter(user => user.role === 'trainer');

   // Actualizar las referencias en el equipo según el rol de los usuarios
    team.playerRefs.addToSet(...players.map(player => player._id));
    team.trainerRefs.addToSet(...trainers.map(trainer => trainer._id));
    
    await User.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { teamRefs: equipoId } }
    );
    await team.save();
    res.status(200).json(team);
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}



//join
//Ver detalles entrenamientos -> readPlan