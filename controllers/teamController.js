const Team = require("../models/TeamModel");

exports.createTeam = async (req, res, next) => {
  let { teamName, category , userRefs, planRefs } = req.body
// Ensure userRefs is an array
      userRefs = Array.isArray(userRefs) ? userRefs : [userRefs];
      planRefs = Array.isArray(planRefs) ? planRefs : [planRefs];  
  try {
     
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

      // Create a new team based on the request body
      const newTeam = new Team({
        teamName,
        category,
        trainerName: req.user.username,
        userRefs,
        planRefs,
        //attendanceRefs: req.user.attendanceRefs

        // Add other properties as needed
      });

      // Save the new team to the database
      const savedTeam = await newTeam.save();
      // Update user documents to include reference to team record
      const updateUserPromises = userRefs.map(userId => User.findByIdAndUpdate(userId, { $push: { teamRefs: savedTeam._id }, $addToSet: { userRefs: { $each: userRefs } }}));

        // Update plan document to include reference to attendance record
        const updatePlanPromises = planRefs.map(planId => Plan.findByIdAndUpdate(planId, { $push: { teamRefs: savedTeam._id }, $addToSet: { planRefs: {$each: planRefs}}}));

        await Promise.all([...updateUserPromises, updatePlanPromises]);
      // Respond with the newly created team
      res.status(200).json(savedTeam);
    
    
    } catch (error) {
    // If an error occurs, return a 500 Internal Server Error status
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  };
};


function validateAndParseObjectIds(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.map(value => {
    try {
      return mongoose.Types.ObjectId(value);
    } catch (error) {
      console.error(`Invalid ObjectId value: ${value}`);
      return null;
    }
  }).filter(value => value !== null);
}

exports.getTeams = async (req, res) => {
  try {
    const team = await Team.find();
    console.log({ message: "team get succesfully", team: team });
    res.status(200).json(team);
  } catch (error) {
    console.error("Error getting team", error);
    res.status(500).json({ error: "error while getting a team" });
  }next (error);
};


exports.getSpecificTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    console.log({ message: "team get succesfully", team: team });
    res.status(200).json(team);

  } catch (error) {
    console.error("Error getting team", error);
    res.status(500).json({ error: "error while getting a team" });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
      
      const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {new: true});
      if (!updatedTeam) {
        return res.status(404).json({ error: "Team not found." });
      }
      console.log({ message: "Team updated successfully.", teamUpdated: updatedTeam})
      res.status(200).json(updatedTeam);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ error: "An error occurred while updating the team." });
    }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
      return res.status(404).json({ error: "Team not found." });
    }

    res.status(200).json({ message: "Team deleted successfully." });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "An error occurred while deleting the team." });
  }
};
