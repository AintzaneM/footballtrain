const router = require('express').Router();

const { createPlan, getPlans, getSpecificPlan, updatePlan, assignExcerciseToPlan, deletePlan } = require('../controllers/planController');


//create a plan -> CREAR UN PLAN (Admin)
router.post("/entrenamientos", createPlan);

//read plans -> VER PLAN

router.get("/entrenamientos", getPlans);
   
//read a specific plan -> VER UN PLAN ESPECÍFICO
router.get("/entrenamientos/:id", getSpecificPlan);

router.post("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", assignExcerciseToPlan)


//update a specific plan -> ACTUALIZAR PLAN ESPECÍFICO    
router.put("/entrenamientos/:id" , updatePlan); 

//delete a specific planr -> ELIMINAR PLAN
router.delete("/entrenamientos/:id", deletePlan);


module.exports = router