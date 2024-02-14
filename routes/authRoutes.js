const router = require('express').Router();

const { createUser, loginUser, updateUser, loggedInUser, deleteUser, logout } = require('../controllers/authController');
const {isLoggedIn, isSignUp, emailAndpasswordValidate, emailAndpasswordValidator} = require('../middlewares/authMiddlewares');
const { userValidator, validate } = require('../middlewares/validators/userValidator');


//create an user signup-> REGISTRO USUARIO
router.post('/registro', isSignUp, userValidator, validate, createUser );

//login an user -> INICIO SESIÓN
router.post("/inicio", isLoggedIn, emailAndpasswordValidator, emailAndpasswordValidate, loginUser);
   
//logged in -> SESIÓN PERSISTENTE
router.get("/loggedin", loggedInUser);

//logged out -> CERRAR SESIÓN
router.get("/logout", isLoggedIn, isLoggedIn, logout);

//update an user -> ACTUALIZAR PERFIL    
router.put("/usuarios/:id", emailAndpasswordValidator, emailAndpasswordValidate, updateUser); 

//delete an user -> ELIMINAR CUENTA USUARIO
router.delete("/usuarios/:id", isLoggedIn, userValidator, validate, deleteUser,);


//TODO
//read all users -> LISTA USUARIOS
//router.get("/usuarios", isAdmin)

module.exports = router