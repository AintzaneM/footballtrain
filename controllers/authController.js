const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

exports.createUser = async (req, res, next) => {
  try {
    console.log("requestbody",req.body)

    const { username, email, password, team, isAdmin } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      team,
      isAdmin,
    });

    const user = await newUser.save();
    console.log({message: "user saved", user});
    res.status(200).json(user);

  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({error: "error while saving a new user"});
  }
};

exports.loginUser = async (req, res, next) => {
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

    res.status(200).json({message: "login successful"});
  } catch (error) {
    console.error("Error login user", error);
    res.status(500).json({error: "error while loggin an user"});
  }
};

exports.loggedInUser = async (req, res) => {
    if (req.session.user) {
        console.log({message: "user is logged in"})
        res.status(200).json({ isLoggedIn: true });
    } else {
        console.log({message: "user is not logged in"})
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

exports.assignUserToPlan = async (req, res) => {
    try {
        const userId = req.params.userId;
        const planId = req.params.planId;
    
        const user = await User.findById(userId);
        const plan = await Plan.findById(planId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        if (!plan) {
          return res.status(404).json({ message: 'Plan not found.' });
        }
    
        // Check if the user is already assigned to the plan
        if (user.planRefs.includes(planId)) {
          return res.status(400).json({ message: 'User is already assigned to the plan.' });
        }
    
        user.planRefs.push(planId);
        await user.save();
    
        return res.status(200).json({ message: 'User assigned to plan successfully.' });
      } catch (error) {
        console.error('Error assigning user to plan:', error);
        return res.status(500).json({ message: 'An error occurred.' });
      }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if(updateData.password) {
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
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
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

