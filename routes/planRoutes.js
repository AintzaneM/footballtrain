const router = require('express').Router();

const { createPlan, getPlans, getSpecificPlan, updatePlan, assignExcerciseToPlan, deletePlan } = require('../controllers/planController');
const roleIsAdmin = require('../middlewares/roleIsAdmin');


//create a plan -> CREAR UN PLAN (Admin)
router.post("/entrenamientos", createPlan, roleIsAdmin);

//read plans -> VER PLANES (Admin & User)
router.get("/entrenamientos", getPlans);
   
//read a specific plan -> VER UN PLAN ESPECÍFICO (Admin & User)
router.get("/entrenamientos/:id", getSpecificPlan);

//assign excerciste to a specific plan -> ASIGNAR EJERCICIO A PLAN ESPECÍFICO (Admin)   
router.post("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", assignExcerciseToPlan, roleIsAdmin)

//update a specific plan -> ACTUALIZAR PLAN ESPECÍFICO (Admin)   
router.put("/entrenamientos/:id" , updatePlan, roleIsAdmin); 

//delete a specific planr -> ELIMINAR PLAN (Admin)
router.delete("/entrenamientos/:id", deletePlan, roleIsAdmin);


module.exports = router