const router = require('express').Router();

const {createTeam , getTeams, getSpecificTeam, updateTeam, deleteTeam} = require('../controllers/teamController');


//create a team -> CREAR UN EQUIPO (Admin)
router.post("/equipos", createTeam);

//read teams -> VER EQUIPOS (Admin & User)
router.get("/equipos", getTeams);
   
//read a specific team -> VER UN EQUIPO ESPECÍFICO (Admin & User)
router.get("/equipos/:id", getSpecificTeam);

//assign excerciste to a specific plan -> ASIGNAR EJERCICIO A PLAN ESPECÍFICO (Admin)   
//router.post("/entrenamientos/:entrenamientoId/ejercicios/:ejercicioId", assignExcerciseToPlan, roleIsAdmin)

//update a specific team -> ACTUALIZAR EQUIPO ESPECÍFICO (Admin)   
router.put("/equipos/:id" , updateTeam); 

//delete a specific team -> ELIMINAR EQUIPO (Admin)
router.delete("/equipos/:id", deleteTeam);


module.exports = router