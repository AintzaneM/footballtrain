const Team = require("../models/TeamModel");

exports.createTeam = async (req, res, next) => {
  try {
    const { teamName, category } = req.body
    // Check if the user making the request is a trainer
    if (req.user && req.user.isTrainer) {
      // Create a new team based on the request body
      const newTeam = new Team({
        teamName,
        category,
        trainerName: req.user.username
        // Add other properties as needed
      });

      if (!teamName) {
        return res.status(400).json({ message: 'Team name is required.' });
      }

      // Check if team with the same name already exists
      const existingTeam = await Team.findOne({ teamName });
      if (existingTeam) {
        return res.status(400).json({ message: 'Team with the same name already exists.' });
      }

      // Save the new team to the database
      const savedTeam = await newTeam.save();

      // Respond with the newly created team
      res.status(200).json(savedTeam);
    } else {
      // If the user is not a trainer, return a 403 Forbidden status
      res.status(403).json({ message: 'Only trainers can create teams.' });
    }
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error status
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const team = await Team.find();
    console.log({ message: "team get succesfully", team: team });
    res.status(200).json(team);
  } catch (error) {
    console.error("Error getting team", error);
    res.status(500).json({ error: "error while getting a team" });
  }
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
