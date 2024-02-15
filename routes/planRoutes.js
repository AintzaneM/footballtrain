const router = require('express').Router();

const { createPlan, getPlans, getSpecificPlan, updatePlan, assignUserToPlan, deletePlan } = require('../controllers/planController');
const roleIsAdmin = require('../middlewares/roleIsAdmin');


//create a plan -> CREAR UN PLAN (Admin)
router.post("/entrenamientos", createPlan);

//read plans -> VER PLANES (Admin & User)
router.get("/entrenamientos", getPlans);
   
//read a specific plan -> VER UN PLAN ESPECÍFICO (Admin & User)
router.get("/entrenamientos/:id", getSpecificPlan);

//assign user to a specific plan -> ASIGNAR EJERCICIO A PLAN ESPECÍFICO (Admin)   
//router.post("/entrenamientos/:entrenamientoId/usuarios/:userId", assignUserToPlan)

//update a specific plan -> ACTUALIZAR PLAN ESPECÍFICO (Admin)   
router.put("/entrenamientos/:id" , updatePlan, roleIsAdmin); 

//delete a specific planr -> ELIMINAR PLAN (Admin)
router.delete("/entrenamientos/:id", deletePlan, roleIsAdmin);


module.exports = router