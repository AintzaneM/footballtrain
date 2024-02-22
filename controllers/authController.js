const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const Club = require("../models/ClubModel");
const Team = require("../models/TeamModel");

const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

exports.createUser = async (req, res, next) => {
  try {
    console.log("requestbody", req.body)
    console.log('SESSION =====> ', req.session);


    const { username, email, password, profilePicture, clubId, teamId, role, clubRefs, teamRefs,
      planRefs, attendanceRefs, } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let clubName = "";
    let teamName = "";

    // Conditionally populate clubName and teamName based on user's role
    if (role === 'player') {
      // Retrieve club and team details by their IDs
      const club = await Club.findById(clubId);
      const team = await Team.findById(teamId);
      
      // Populate clubName and teamName if club and team exist
      if (club) {
        clubName = club.clubName;
      }
      if (team) {
        teamName = team.teamName;
      }
    }
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      clubName,
      teamName,
      role,
      teamRefs,
      attendanceRefs,
      planRefs,
      clubRefs,
    });

    const user = await newUser.save();

    if (role === 'trainer' && (clubId || teamId)) {
      let update = {};
      if (clubId) {
        const club = await Club.findById(clubId);
        if (club) {
          update.clubName = club.clubName;
        }
      }
      if (teamId) {
        const team = await Team.findById(teamId);
        if (team) {
          update.teamName = team.teamName;
        }
      }
      // Update user with clubName and teamName
      await User.findByIdAndUpdate(user._id, update);
    }
    console.log({ message: "user saved", user });
    res.status(200).json(user);
    next();
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({ error: "error while saving a new user" });
  }
};

exports.loginUser = async (req, res, next) => {
      console.log('SESSION =====> ', req.session);

  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    !user && res.status(404).send("user not found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");
    req.session.user = user;

    res.status(200).json({ message: "login successful" });
    next();
  } catch (error) {
    console.error("Error login user", error);
    res.status(500).json({ error: "error while loggin an user" });
  }
};

exports.loggedInUser = async (req, res, next) => {
  if (req.session.user) {
    console.log({ message: "user is logged in" })
    res.status(200).json({ isLoggedIn: true });
    next();
  } else {
    console.log({ message: "user is not logged in" })
    res.status(200).json({ isLoggedIn: false });
  };

};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    return res.status(200).json({ message: "Logged out succesfully" });
  });
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Specified team id is not valid: {userId}' });
      return;
    }
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    console.log({ message: "User updated successfully.", userUpdated: updatedUser });
    res.status(200).json(updatedUser);
    next();
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Specified team id is not valid: {userId}' });
      return;
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

