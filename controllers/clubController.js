const Club = require("../models/ClubModel");
const Team = require("../models/TeamModel");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");


exports.createClub = async (req, res, next) => {
  let {
    clubName,
    trainerRefs,
    playerRefs,
    teamRefs,
  } = req.body;

  try {

    // Ensure each refs is an array

    trainerRefs = Array.isArray(trainerRefs) ? trainerRefs : [trainerRefs];
    playerRefs = Array.isArray(playerRefs) ? playerRefs : [playerRefs];
    teamRefs = Array.isArray(teamRefs) ? teamRefs : [teamRefs];


    if (req.user && req.user.role.toLowerCase() !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create clubs.' });
    }

    // Check if clubName is provided
    if (!clubName) {
      return res.status(400).json({ message: 'Club name is required.' });
    }

    // Check if club with the same name already exists
    const existingClub = await Club.findOne({ clubName });
    if (existingClub) {
      return res.status(400).json({ message: 'Club with the same name already exists.' });
    }

    // Create a variable to check if the club already exists
    const clubExists = existingClub !== null;

    const trainers = await User.find({ clubName, role: 'trainer' });
    const players = await User.find({ clubName, role: 'player' });

    trainerRefs = trainers.map(trainer => trainer._id);
    playerRefs = players.map(player => player._id);

    const newClub = new Club({
      clubName,
      trainerRefs: trainerRefs,
      playerRefs: playerRefs,
      teamRefs
    });

    const club = await newClub.save();
    const updateUserPromises = [...trainerRefs, ...playerRefs].map(userId => User.findByIdAndUpdate(userId, { $push: { clubRefs: club._id } }, { new: true }));

    const updateTeamPromises = teamRefs.map(teamId => Team.findByIdAndUpdate(teamId, { $push: { clubRefs: club._id } }, { new: true }));

    await Promise.all([...updateUserPromises, ...updateTeamPromises]);

    res.status(200).json({ club: club, clubExists: clubExists });
    next();
  } catch (error) {
    console.error("Error creating club", error);
    res.status(500).json({ error: "error while saving a new club" });
  }
};

exports.getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find();
    console.log({ message: "club get succesfully", club: clubs });
    res.status(200).json(clubs);
    next();
  } catch (error) {
    console.error("Error getting club", error);
    res.status(500).json({ error: "error while getting an club" });
  }
};

exports.getSpecificClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    console.log({ message: "club get succesfully", club: club });
    res.status(200).json(club);
    next();
  } catch (error) {
    console.error("Error getting club", error);
    res.status(500).json({ error: "error while getting an club" });
  }
};

exports.updateClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    console.log(clubId)
     if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ error: 'Invalid club ID: {clubId}' });
    }
    const updateData = req.body;
      
      const updatedClub = await Club.findByIdAndUpdate(clubId, updateData, {new: true});
      if (!updatedClub) {
        return res.status(404).json({ error: "Club not found." });
      }
      console.log({ message: "Club updated successfully.", clubUpdated: updatedClub })
      res.status(200).json(updatedClub);
      next();
    } catch (error) {
      console.error("Error updating club:", error);
      res.status(500).json({ error: "An error occurred while updating the club." });
    }
};

exports.deleteClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      res.status(400).json({ message: 'Specified club id is not valid: {clubId}' });
      return;
    }
    const deletedClub = await Club.findByIdAndDelete(clubId);
    if (!deletedClub) {
      return res.status(404).json({ error: "Club not found." });
    }

    res.status(200).json({ message: "Club deleted successfully." });
    next();
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ error: "An error occurred while deleting the club." });
  }
};