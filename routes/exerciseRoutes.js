const router = require('express').Router();

const { createExercise, getExercises, getSpecificExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');


//create an excercise -> CREAR UN EJERCICIO (Admin)
router.post("/ejercicios", createExercise);

//read excercises -> VER EJERCICIO

router.get("/ejercicios", getExercises);
   
//read a specific excercise -> VER UN EJERCICIO ESPECÍFICO
router.get("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", getSpecificExercise);


//update a specific excercise -> ACTUALIZAR EJERCICIO ESPECÍFICO    
router.put("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId" , updateExercise); 

//delete a specific planr -> ELIMINAR PLAN
router.delete("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", deleteExercise);


module.exports = router