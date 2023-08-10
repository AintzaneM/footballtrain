const Plan = require("../models/PlanModel");
const Exercise = require("../models/ExerciseModel");

exports.createPlan = async (req, res, next) => {
  try {
    const {
      category,
      planTitle,
      planDescription,
      dateStart,
      dateEnd,
      progress,
      excerciseRefs,
      userRefs,
    } = req.body;

    const newPlan = new Plan({
      category,
      planTitle,
      planDescription,
      dateStart,
      dateEnd,
      progress,
      excerciseRefs: [],
      userRefs: [],
    });

    const plan = await newPlan.save();
    console.log({ message: "plan saved", plan });
    res.status(200).json(plan);
  } catch (error) {
    console.error("Error creating plan", error);
    res.status(500).json({ error: "error while saving a new plan" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    console.log({ message: "plans get succesfully", plans: plans });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error getting plans", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};

exports.assignExcerciseToPlan = async (req, res) => {
  try {
    const ejercicioId = req.params.ejercicioId;
    const entrenamientoId = req.params.entrenamientoId;

    const exercise = await Exercise.findById(ejercicioId);
    const plan = await Plan.findById(entrenamientoId);
    
    if (!exercise) {
      return res.status(404).json({ message: "Excercise not found." });
    }

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Check if the user is already assigned to the plan
    if (plan.excerciseRefs.includes(ejercicioId)) {
      
      return res
        .status(400)
        .json({ message: "Exercise is already assigned to the plan." });
    }

    plan.excerciseRefs.push(ejercicioId);
    await plan.save();

    return res
      .status(200)
      .json({ message: "Exercise assigned to plan successfully." });
  } catch (error) {
    console.error("Error assigning exercise to plan:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    console.log({
      message: "User updated successfully.",
      userUpdated: updatedUser,
    });
    res.status(200).json(userUpdated);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

exports.getSpecificPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    console.log({ message: "plan get succesfully", plan: plan });
    res.status(200).json(plan);
  } catch (error) {
    console.error("Error getting plan", error);
    res.status(500).json({ error: "error while getting a plan" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, {
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
  } catch (error) {
    console.error("Error updating plan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the plan." });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};
