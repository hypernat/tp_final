const express = require('express');
const router = express.Router();
const pool = require('./db');

router.post('/login', async (req, res) => {
    const { nombre, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM empleados WHERE nombre = $1 AND password = $2',
            [nombre, password]
        );
        if (result.rows.length > 0){
            res.sendFile(__dirname + '/empleados.html');
        } else {
            res.status(401).json({ error: 'Nombre o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;