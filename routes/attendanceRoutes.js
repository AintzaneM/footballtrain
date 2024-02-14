const router = require('express').Router();

const { attendanceRegister, markAttendance } = require('../controllers/attendanceController');
const { isLoggedIn } = require('../middlewares/authMiddlewares');


//get an user attendance register-> REGISTRO DE ASISTENCIA (Admin)
router.get('/attendanceRegister', attendanceRegister );

//mark the user attendance -> MARCAR ASISTENCIA USUARIOS (Admin)
router.post("/markAttendance", markAttendance);
   

module.exports = router