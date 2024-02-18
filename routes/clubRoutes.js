const router = require('express').Router();

const { createClub, getClubs, getSpecificClub, updateClub, deleteClub } = require('../controllers/clubController');
//const roleIsAdmin = require('../middlewares/roleIsAdmin');


//create an club -> CREAR UN CLUB (Admin)
router.post("/club", createClub);

//read club -> VER CLUB (Admin & User)

router.get("/clubs", getClubs);
   
//read a specific club -> VER UN CLUB ESPECÍFICO (Admin & User)
router.get("/clubs/:clubId", getSpecificClub);


//update a specific club -> ACTUALIZAR CLUB ESPECÍFICO (Admin)  
router.put("/clubs/:clubId" , updateClub); 

//delete a specific club -> ELIMINAR CLUB (Admin) 
router.delete("/clubs/:clubId", deleteClub);


//assignar

module.exports = router