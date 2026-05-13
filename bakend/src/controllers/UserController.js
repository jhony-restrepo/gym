const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Registro
exports.register = async (req, res) => {
    const { nombre, email, password, id_rol } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, id_rol || 3]
        );
        res.status(201).json({ mensaje: "Usuario creado" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 2. Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ mensaje: "No existe el usuario" });
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ mensaje: "Clave incorrecta" });
        
        const token = jwt.sign({ id: rows[0].id_usuario, rol: rows[0].id_rol }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, rol: rows[0].id_rol, nombre: rows[0].nombre });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 3. Listar Miembros (¡Aquí suele estar el error!)
exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id_usuario, nombre, email, id_rol FROM usuarios');
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 4. Asignar Rutina
exports.asignarRutina = async (req, res) => {
    const { id_cliente, descripcion } = req.body;
    try {
        await db.execute('INSERT INTO rutinas (id_cliente, id_instructor, descripcion) VALUES (?, ?, ?)', 
        [id_cliente, req.user.id, descripcion]);
        res.status(201).json({ mensaje: "Rutina guardada" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 5. Ver Mis Rutinas
exports.getMisRutinas = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.descripcion, r.fecha_asignacion, u.nombre as instructor 
            FROM rutinas r JOIN usuarios u ON r.id_instructor = u.id_usuario 
            WHERE r.id_cliente = ?`, [req.user.id]);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};