const router = require('express').Router();

const {assignUserToPlan, getUsers, assignPlayersToTeam, assignTrainersToTeam} = require('../controllers/userController');


//read all users -> LISTA USUARIOS

router.get("/usuarios", getUsers)

//assign users to plan
router.post("/usuarios/:userId/entrenamientos/:entrenamientoId", assignUserToPlan)
//assign team to user
router.put("/equipos/:equipoId/asignarEquipoJugadores", assignPlayersToTeam  )


router.put("/equipos/:equipoId/asignarEquipoEntrenadores",assignTrainersToTeam)
//assign team to a club
//assign plan to a user
//assign
//Cada usuario estará registrado en la app. 
//Será el entrenador quien incluya a cada jugador en el entrenamiento



module.exports = router