const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas con protección por Token
router.get('/list', verifyToken, userController.getUsers);
router.get('/mis-rutinas', verifyToken, userController.getMisRutinas);
router.post('/rutinas', verifyToken, checkRole([1, 2]), userController.asignarRutina);

module.exports = router;