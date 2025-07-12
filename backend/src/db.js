const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: 'localhost',
  port: 5433,
  database: 'pethub',
})

// manejar errores

async function getAllMascotas() {
    const result = await dbClient.query('SELECT * FROM mascotas;');
    return result.rows;
}

async function getOneMascota(id) {
    const result = await dbClient.query('SELECT * FROM mascotas WHERE id = $1 LIMIT 1;', [id]);
    return result.rows[0];
}

module.exports = {
    getAllMascotas,
    getOneMascota,
}; 
     