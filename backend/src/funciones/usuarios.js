const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: 'pethub',
})

async function getAllUsuarios() {
    const result = await dbClient.query('SELECT * FROM usuarios;');
    return result.rows;
}

async function getOneUsuario(id) {
    const result = await dbClient.query('SELECT * FROM usuarios WHERE id = $1 LIMIT 1;', [id]);
    return result.rows[0];
}

async function createUsuario(
    nombre,
    email, 
    telefono,
    direccion,
    tiene_patio,
    tiene_mas_mascotas
) {
    const result = await dbClient.query(
        'INSERT INTO usuarios (nombre, email, telefono, direccion, tiene_patio, tiene_mas_mascotas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
        [nombre, email, telefono, direccion, tiene_patio, tiene_mas_mascotas]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteUsuario(id) {
    const results = await dbClient.query('DELETE FROM usuarios WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

async function updateUsuario(id,
    nombre,
    email, 
    telefono,
    direccion,
    tiene_patio,
    tiene_mas_mascotas
 ) {
    const result = await dbClient.query('UPDATE usuarios SET nombre = $1, email = $2, telefono = $3, direccion = $4, tiene_patio = $5, tiene_mas_mascotas = $6 WHERE id = $7 RETURNING *;',
        [nombre, email, telefono, direccion, tiene_patio, tiene_mas_mascotas, id]);
    if (result.rowCount === 0 ) {
        return undefined;
    }
    return result.rows[0];
 }

async function existeEnTabla(tabla, id) {
    const res = await dbClient.query(`SELECT 1 FROM ${tabla} WHERE id = $1 LIMIT 1`, [id]);
    return res.rowCount > 0;
}

module.exports = {
    getAllUsuarios,
    getOneUsuario,
    createUsuario,
    deleteUsuario,
    updateUsuario,
    existeEnTabla
}; 