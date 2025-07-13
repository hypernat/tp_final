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

async function createMascota(
    nombre,
    especie,
    edad_estimada,
    tamaño,
    esta_vacunado,
    imagen,
    descripcion
) {
    const result = await dbClient.query(
        'INSERT INTO MASCOTAS (nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
        [nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteMascota(id) {
    const results = await dbClient.query('DELETE FROM mascotas WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

module.exports = {
    getAllMascotas,
    getOneMascota,
    createMascota,
    deleteMascota,
}; 
     