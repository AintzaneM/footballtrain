const router = require('express').Router();

const {assignUserToPlan, assignUserToTeam, getUsers} = require('../controllers/userController');


//read all users -> LISTA USUARIOS

router.get("/usuarios", getUsers)

//assign users to plan
router.post("/usuarios/:userId/entrenamientos/:entrenamientoId", assignUserToPlan)
//assign users to team
router.post("/usuarios/:userId/equipos/:equipoId", assignUserToTeam )

module.exports = router