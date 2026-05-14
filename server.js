const express = require('express');
const cors = require('cors');
const app = express();

// 1. Middleware para que Express entienda JSON
app.use(express.json());

// 2. ⚠️ CONFIGURACIÓN DE CORS
// Esto permite que tu Frontend en Vercel se comunique con este Servidor en Render
app.use(cors({
    origin: [
        'https://gym-interfaz.vercel.app', // <-- REEMPLAZA ESTO: Pon aquí el link que te dé Vercel al subir el frontend
        'http://localhost:5173'            // Esto permite que sigas probando en tu PC (Vite)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 3. Ruta raíz de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: "API Gym v1.0 - Conectada exitosamente 🚀",
        estado: "Servidor en línea"
    });
});

// 4. Ejemplo de ruta para tu software de gimnasio
// Aquí es donde conectarás tus archivos de rutas más adelante
// app.use('/api/clientes', require('./routes/clientes'));

// 5. Definición del puerto (Render asigna uno automáticamente mediante process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// 6. ⚠️ Exportar la app para compatibilidad con hosting moderno
module.exports = app;