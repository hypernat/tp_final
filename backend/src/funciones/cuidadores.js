const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: 'pethub',
})

async function getAllCuidador() {
    const result = await dbClient.query('SELECT * FROM cuidador;');
    return result.rows;
}

async function getOneCuidador(id) {
    const result = await dbClient.query('SELECT * FROM cuidador WHERE id = $1 LIMIT 1;', [id]);
    return result.rows[0];
}

async function createCuidador(
    nombre,
    email,
    tipo,
    animales_a_cargo,
    disponibilidad_horaria,
) {
    const result = await dbClient.query(
        'INSERT INTO cuidador (nombre, email, tipo, animales_a_cargo, disponibilidad_horaria) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [nombre, email, tipo, animales_a_cargo, disponibilidad_horaria]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteCuidador(id) {
    const results = await dbClient.query('DELETE FROM cuidador WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

async function updateCuidador(id,
    nombre,
    email,
    tipo,
    animales_a_cargo,
    disponibilidad_horaria,
 ) {
    const result = await dbClient.query('UPDATE cuidador SET nombre = $1, email = $2, tipo = $3, animales_a_cargo = $4, disponibilidad_horaria = $5 WHERE id = $6 RETURNING *;',
        [nombre, email, tipo, animales_a_cargo, disponibilidad_horaria, id]);
    if (result.rowCount === 0 ) {
        return undefined;
    }
    return result.rows[0];
 }

module.exports = {
    getAllCuidador,
    getOneCuidador,
    createCuidador,
    deleteCuidador,
    updateCuidador
}; 