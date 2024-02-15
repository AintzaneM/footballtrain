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
    console.error("Error getting plans", error);
    res.status(500).json({ error: "error while getting a plan" });
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

exports.assignUserToTeam = async (req, res, next) => {
  try {
    const { userId, equipoId } = req.params;

    // Validate user ID and plan ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(equipoId)) {
      return res.status(400).json({ message: "Invalid user or plan ID." });
    }


    // Check if the user and team exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const team = await Team.findById(equipoId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if the user is already assigned to the team
    if (team.userRefs.includes(userId)) {
      return res.status(400).json({ message: "User is already assigned to the plan." });
    }

    // Associate the user with the team
    user.teamRefs.push(equipoId);
    await user.save();

    return res.status(200).json({ message: "User assigned to plan successfully." });
  } catch (error) {
    console.error("Error associating user with team:", error);
    res.status(500).json({ error: "Error associating user with team" });
  }
};


//join
//Ver detalles entrenamientos -> readPlan