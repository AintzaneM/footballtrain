const router = require('express').Router();

const { createUser, loginUser, updateUser, loggedInUser, deleteUser, assignUserToPlan } = require('../controllers/userController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { userValidator, validate } = require('../middlewares/validators/userValidator');


//create an user -> REGISTRO USUARIO
router.post('/registro', userValidator, validate, createUser);

//login an user -> INICIO SESIÖN

router.post("/inicio", loginUser);
   
//logged in -> SESIÖN PERSISTENTE
router.get("/loggedin", loggedInUser);

//read all users -> LISTA USUARIOS

router.get("/usuarios")

//assign users to plan

router.post("/usuarios/:userId/entrenamientos/:planId", assignUserToPlan)

//update an user -> ACTUALIZAR PERFIL    
router.put("/usuarios/:id" , updateUser); 

//delete an user -> ELIMINAR CUENTA USUARIO
router.delete("/usuarios/:id", deleteUser);

module.exports = router