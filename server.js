const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para que Express entienda JSON
app.use(express.json());

// ⚠️ CONFIGURACIÓN DE CORS (Crucial para conectar Vercel con Frontend)
app.use(cors({
    origin: [
        'https://gim-tuusuario.vercel.app', // <-- REEMPLAZA ESTO POR EL DOMINIO DE TU FRONTEND EN VERCEL
        'http://localhost:5173'             // Permite probar localmente en tu PC
    ],
    credentials: true
}));

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: "API Gym v1.0 - Conectada exitosamente 🚀" });
});

// Ejemplo de otra ruta para tu software
// app.use('/api/clientes', require('./routes/clientes'));

// Definición del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// ⚠️ IMPORTANTE: Exportar la app para que Vercel Serverless la reconozca
module.exports = app;