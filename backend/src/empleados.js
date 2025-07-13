const express = require('express');
const router = express.Router();
const db = require('./mascotas');

// =================== LOGIN ===================
router.post('/login', async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const result = await db.dbClient.query(
      'SELECT * FROM empleados WHERE nombre = $1 AND password = $2',
      [nombre, password]
    );

    if (result.rows.length > 0) {
      res.sendFile(__dirname + '/../frontend/empleados.html');
    } else {
      res.status(401).json({ error: 'Nombre o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== GET ALL ===================
router.get('/', async (req, res) => {
  try {
    const result = await db.dbClient.query('SELECT * FROM empleados ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== GET ONE ===================
router.get('/:id', async (req, res) => {
  try {
    const result = await db.dbClient.query('SELECT * FROM empleados WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== CREATE ===================
router.post('/', async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) {
    return res.status(400).json({ error: 'Nombre y contraseña requeridos' });
  }

  try {
    const result = await db.dbClient.query(
      'INSERT INTO empleados (nombre, password) VALUES ($1, $2) RETURNING *',
      [nombre, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== UPDATE ===================
router.put('/:id', async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const result = await db.dbClient.query(
      'UPDATE empleados SET nombre = $1, password = $2 WHERE id = $3 RETURNING *',
      [nombre, password, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== DELETE ===================
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.dbClient.query('DELETE FROM empleados WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado eliminado', empleado: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
