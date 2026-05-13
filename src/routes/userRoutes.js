const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas abiertas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas (El error estaba aquí, asegúrate de que getUsers exista en el controlador)
router.get('/list', verifyToken, userController.getUsers); 
router.get('/mis-rutinas', verifyToken, userController.getMisRutinas);
router.post('/rutinas', verifyToken, checkRole([1, 2]), userController.asignarRutina);

module.exports = router;