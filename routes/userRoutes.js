const router = require('express').Router();

const {assignUserToPlan, getUsers, assignPlayersToTeam, assignTrainersToTeam, assignClubToTeam, assignPlanToTeam} = require('../controllers/userController');


//read all users -> LISTA USUARIOS

router.get("/usuarios", getUsers)

//assign users to plan
router.post("/usuarios/:userId/entrenamientos/:entrenamientoId", assignUserToPlan)
//assign Player to a Team
router.put("/equipos/:equipoId/asignarEquipoJugadores", assignPlayersToTeam)
//assign Trainer to a Team
router.put("/equipos/:equipoId/asignarEquipoEntrenadores",assignTrainersToTeam)
//assign Club to a Team
router.put("/asignarClubEquipo", assignClubToTeam)
//assign Plan to a Team
router.put("/asignarPlanEquipo", assignPlanToTeam)


//Cada usuario estará registrado en la app. 
//Será el entrenador quien incluya a cada jugador en el entrenamiento



module.exports = router