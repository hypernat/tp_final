const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: 'localhost',
  port: 5433,
  database: 'pethub',
})

async function getAllCuidadores() {
    const result = await dbClient.query('SELECT * FROM cuidadores;');
    return result.rows;
}

async function getOneCuidador(id) {
    const result = await dbClient.query('SELECT * FROM cuidadores WHERE id = $1 LIMIT 1;', [id]);
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
        'INSERT INTO cuidadores (nombre, email, tipo, animales_a_cargo, disponibilidad_horaria) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [nombre, email, tipo, animales_a_cargo, disponibilidad_horaria,]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteCuidador(id) {
    const results = await dbClient.query('DELETE FROM cuidadores WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

module.exports = {
    getAllCuidadores,
    getOneCuidador,
    createCuidador,
    deleteCuidador,
}; 