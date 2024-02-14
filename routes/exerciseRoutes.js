const router = require('express').Router();

const { createExercise, getExercises, getSpecificExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const roleIsAdmin = require('../middlewares/roleIsAdmin');


//create an excercise -> CREAR UN EJERCICIO (Admin)
router.post("/ejercicios", createExercise, roleIsAdmin);

//read excercises -> VER EJERCICIO (Admin & User)

router.get("/ejercicios", getExercises);
   
//read a specific excercise -> VER UN EJERCICIO ESPECÍFICO (Admin & User)
router.get("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", getSpecificExercise);


//update a specific excercise -> ACTUALIZAR EJERCICIO ESPECÍFICO (Admin)  
router.put("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId" , updateExercise, roleIsAdmin); 

//delete a specific planr -> ELIMINAR PLAN (Admin) 
router.delete("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", deleteExercise, roleIsAdmin);


module.exports = router