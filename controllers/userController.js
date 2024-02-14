const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const { default: mongoose } = require("mongoose");



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




//join
//Ver detalles entrenamientos -> readPlan