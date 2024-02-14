const router = require('express').Router();

const {assignUserToPlan } = require('../controllers/userController');


//read all users -> LISTA USUARIOS

router.get("/usuarios")

//assign users to plan

//router.post("/usuarios/:userId/entrenamientos/:planId", assignUserToPlan)
