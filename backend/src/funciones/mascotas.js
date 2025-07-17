const {Pool} = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
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
    descripcion,
    id_cuidador
) {
    const result = await dbClient.query(
        'INSERT INTO mascotas (nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion, id_cuidador) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
        [nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion, id_cuidador]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteMascota(id) {
    // Primero borrar formularios que referencian la mascota
    await dbClient.query('DELETE FROM formularios_adopcion WHERE id_mascota = $1;', [id]);

    // Luego borrar la mascota
    const results = await dbClient.query('DELETE FROM mascotas WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

async function updateMascota(id,
    nombre,
    especie,
    edad_estimada,
    tamaño,
    esta_vacunado,
    imagen,
    descripcion,
    id_cuidador
 ) {
    const result = await dbClient.query('UPDATE mascotas SET nombre = $1, especie = $2, edad_estimada = $3, tamaño = $4, esta_vacunado = $5, imagen = $6, descripcion = $7, id_cuidador = $8 WHERE id = $9 RETURNING *;',
        [nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion, id_cuidador, id]);
    if (result.rowCount === 0 ) {
        return undefined;
    }
    return result.rows[0];
 }


async function getAllMascotasConCuidador() {
  const sql = `
    SELECT m.*, c.nombre as cuidador_nombre, c.email as cuidador_email, c.disponibilidad_horaria as cuidador_disponibilidad
    FROM mascotas m
    LEFT JOIN cuidador c ON m.id_cuidador = c.id
  `;
  const result = await dbClient.query(sql);
  return result.rows;
}


async function getOneCuidador(id) {
  const result = await dbClient.query(
    'SELECT * FROM cuidador WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0]; // devuelve un objeto con el cuidador o undefined si no existe
}

module.exports = {
    getAllMascotas,
    getOneMascota,
    createMascota,
    deleteMascota,
    updateMascota,
    getAllMascotasConCuidador,
    getOneCuidador,
}; 
     