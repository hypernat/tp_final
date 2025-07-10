const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: 'localhost',
  port: 5432,
  database: 'pethub',
})

async function getAllMascotas() {
    const result = await dbClient.query('SELECT * FROM mascotas;');
    return result.rows;
}

module.exports = {
    getAllMascotas
}; 
     