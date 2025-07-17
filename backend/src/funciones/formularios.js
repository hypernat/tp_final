const {Pool} = require('pg');
const { deleteMascota } = require('./mascotas');

const dbClient = new Pool({
  user: 'postgres',
  password: 'password123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: 'pethub',
})

async function getAllFormularios() {
    const result = await dbClient.query('SELECT * FROM formularios_adopcion;');
    return result.rows;
}

async function getOneFormulario(id) {
    const result = await dbClient.query('SELECT * FROM formularios_adopcion WHERE id = $1 LIMIT 1;', [id]);
    return result.rows[0];
}

async function createFormulario(
    fecha,
    estado,
    id_mascota,
    id_usuario,
    id_cuidador,
    comentario,
) {
    const result = await dbClient.query(
        'INSERT INTO formularios_adopcion (fecha, estado, id_mascota, id_usuario, id_cuidador, comentario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
        [fecha, estado, id_mascota, id_usuario, id_cuidador, comentario]);
    if (result.rowCount === 0){
        return undefined;
    }
    return result.rows[0];
}

async function deleteFormulario(id) {
    const results = await dbClient.query('DELETE FROM formularios_adopcion WHERE id = $1;', [id]);
    
    if (results.rowCount === 0 ) {
        return undefined;
    }
    return id;
}

async function updateFormulario(id,
    fecha,
    estado,
    id_mascota,
    id_usuario,
    id_cuidador,
    comentario,
 ) {
    const result = await dbClient.query('UPDATE formularios_adopcion SET fecha = $1, estado = $2, id_mascota = $3, id_usuario = $4, id_cuidador = $5, comentario = $6 WHERE id = $7 RETURNING *;',
    [fecha, estado, id_mascota, id_usuario, id_cuidador, comentario, id]);
    if (result.rowCount === 0 ) {
        return undefined;
    }

    if (estado.toLowerCase() === 'aceptado'){
        try {
            const mascotaEliminaada = await deleteMascota(id_mascota);
            if (!mascotaEliminaada) {
                throw new Error('Mascota no encontrada o no se pudo eliminar');
            }
        } catch (error) {
            throw error;
        }
    }

    return result.rows[0];
 }

async function existeEnTabla(tabla, id) {
    const res = await dbClient.query(`SELECT 1 FROM ${tabla} WHERE id = $1 LIMIT 1`, [id]);
    return res.rowCount > 0;
}

module.exports = {
    getAllFormularios,
    getOneFormulario,
    createFormulario,
    deleteFormulario,
    existeEnTabla,
    updateFormulario
}; 