const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: 'localhost',
  port: 5433,
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

module.exports = {
    getAllUsuarios,
    getOneUsuario,
    createUsuario,
    deleteUsuario,
}; 