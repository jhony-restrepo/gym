const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 21363, // Agregamos el puerto de Aiven
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // ⚠️ ESTO ES LO QUE PIDE AIVEN PARA CONEXIONES SEGURAS
    ssl: {
        rejectUnauthorized: false
    }
});

// Prueba de conexión inmediata
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de datos conectada en la nube: ' + process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
        console.error('Revisa que las variables en Render coincidan con Aiven.');
    });

module.exports = pool;