const Exercise = require("../models/ExerciseModel");

exports.createExercise = async (req, res, next) => {
  try {
    const {
      exerciseName,
      exerciseDescription,
      repetitions,
      sets,
      planRefs,
    } = req.body;

    const newExercise = new Exercise({
      exerciseName,
      exerciseDescription,
      repetitions,
      sets,
      planRefs:[],
    });

    const exercise = await newExercise.save();
    console.log({ message: "excercise saved", exercise });
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error creating excercise", error);
    res.status(500).json({ error: "error while saving a new excercise" });
  }
};

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    console.log({ message: "exercise get succesfully", exercises: exercises });
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error getting exercises", error);
    res.status(500).json({ error: "error while getting an exercise" });
  }
};

exports.getSpecificExercise = async (req, res) => {
  try {
    const { ejercicioId } = req.params;
    const exercise = await Exercise.findById(ejercicioId);
    console.log({ message: "excercise get succesfully", exercise: exercise });
    res.status(200).json(exercise);

  } catch (error) {
    console.error("Error getting exercise", error);
    res.status(500).json({ error: "error while getting an exercise" });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { ejercicioId } = req.params;
    const updateData = req.body;
      
      const updatedExercise = await Exercise.findByIdAndUpdate(ejercicioId, updateData, {new: true});
      if (!updatedExercise) {
        return res.status(404).json({ error: "Exercise not found." });
      }
      console.log({ message: "Excercise updated successfully.", exerciseUpdated: updatedExercise })
      res.status(200).json(updatedExercise);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "An error occurred while updating the exercise." });
    }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { ejercicioId } = req.params;
    const deletedExercise = await Exercise.findByIdAndDelete(ejercicioId);
    if (!deletedExercise) {
      return res.status(404).json({ error: "Exercise not found." });
    }

    res.status(200).json({ message: "Exercise deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting the exercise." });
  }
};