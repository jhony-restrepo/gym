const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión inmediata
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de datos conectada: ' + process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
    });

module.exports = pool;