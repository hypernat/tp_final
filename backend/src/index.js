const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imagenes', express.static('imagenes'));

const PORT = process.env.PORT || 3000;

// funciones
const {
  getAllMascotas,
  getOneMascota,
  createMascota,
  deleteMascota,
} = require('./funciones/mascotas');

const {
  getAllUsuarios,
  getOneUsuario,
  createUsuario,
  deleteUsuario,
} = require('./funciones/usuarios');

const {
  getAllCuidador,
  getOneCuidador,
  createCuidador,
  deleteCuidador,
} = require('./funciones/cuidadores');

const {
  getAllFormularios,
  getOneFormulario,
  createFormulario,
  deleteFormulario,
  existeEnTabla,
} = require('./funciones/formularios.js')

const empleadosRouter = require('./empleados.js');
app.use('/empleados', empleadosRouter);


// ruta health
app.get('/index/health', (req, res) => {
  res.json({ status: 'todo ok por aca' });
});
app.listen(PORT, () => {
  console.log("Servidor backend escuchando en PORT",PORT);
});

// ver que hacer si se borra algo que tiene foregin keys asociadas
//ordenar en carpetas y MODULARIZAR
//mascotas
app.get('/index/mascotas', async (req, res) => {
  const mascotas = await getAllMascotas();
  res.json(mascotas);
});
app.get('/index/mascotas/:id', async (req, res) => {
  const mascota = await getOneMascota(req.params.id);
  if (!mascota) {
    return res.status(404).json({ error: 'Upsi, mascota no encontrada :('});
  }
  res.json(mascota);
});
// mascotas con menos solicitudes
app.get('/index/mascotas/menos-solicitudes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.nombre, m.imagen, COUNT(f.id)
      FROM mascotas m, formularios_adopcion f
      WHERE m.id = f.id_mascota
      GROUP BY m.id, m.nombre, m.imagen
      ORDER BY COUNT(f.id) ASC
      LIMIT 3;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mascotas con menos solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

/*
PARA PROBAR
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"nombre":"nievecita","especie":"conejito","edad_estimada":2,"tamaño":"pequeño","esta_vacunado":true,"imagen":"xyz","descripcion":"le gusta la lechuga y jugar!"}' \
  http://localhost:3000/index/mascotas
*/
app.post('/index/mascotas', async (req, res) => {

  if(!req.body.nombre || !req.body.especie || !req.body.edad_estimada || !req.body.tamaño || 
     !req.body.esta_vacunado || !req.body.descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!'})
  }

  if (req.body.edad_estimada < 0 || req.body.edad_estimada > 80) {
    return res.status(400).json({ error: 'La edad estimada debe estar entre 0 y 80 años' });
  }

  if (typeof req.body.esta_vacunado !== 'boolean') {
  return res.status(400).json({ error: 'La respuesta de si esta vacunado debe ser solo true / false !!' });
  }

  if (!Number.isInteger(req.body.edad_estimada)) {
  return res.status(400).json({ error: 'Edad debe ser un número entero' });
 }

  const mascota = await createMascota(
    req.body.nombre, 
    req.body.especie, 
    req.body.edad_estimada, 
    req.body.tamaño, 
    req.body.esta_vacunado, 
    req.body.imagen, 
    req.body.descripcion
  );
  if(!mascota) {
    return res.status(500).json({ error: 'Algo falló al crear la mascota'})
  }
  res.json({mascota});
});
/* PARA PROBAR
curl --request DELETE \
  http://localhost:3000/index/mascotas/:13
*/
app.delete('/index/mascotas/:id', async (req, res) => {

    const mascota = await deleteMascota(req.params.id);

    if (!mascota) {
      return res.status(404).json({error: 'Upsi, mascota no encontrada, no se puede eliminar'})
    }

    res.json({ status: 'OK', id: mascota });
});
/*app.put('/index/mascotas/:id', async (req, res) => {
  const mascota = await updateMascota(req.params.id);
  if (!mascota) {
    return res.status(404).json({ error: 'Upsi, mascota no encontrada :('});
  }
  res.json({ status: 'OK', id: mascota });
});*/

//user
app.get('/index/usuarios', async (req, res) => {
  const usuarios = await getAllUsuarios();
  res.json(usuarios);
});
app.get('/index/usuarios/:id', async (req, res) => {
  const usuario = await getOneUsuario(req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: 'Upsi, usuario no encontrado :('});
  }
  res.json(usuario);
});
app.post('/index/usuarios', async (req, res) => {

  if(!req.body.nombre || !req.body.email || !req.body.telefono || !req.body.direccion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!'})
  }

  const telefonoRegex = /^(?:\+54)?(?:9)?[0-9]{10,11}$/;
  if (!telefonoRegex.test(req.body.telefono)) {
    return res.status(400).json({ error: 'Numero de telefono invalido, solo se aceptan numeros argentinos!' });
  }
  
  const emailAValidar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAValidar.test(req.body.email)) {
    return res.status(400).json({ error: 'Email invalido' });
  }

  if (typeof req.body.tiene_mas_mascotas !== 'boolean' ) {
  return res.status(400).json({ error: 'La respuesta de si tenes mas mascotas debe ser solo true / false !!' });
  }

  if (typeof req.body.tiene_patio !== 'boolean' ) {
  return res.status(400).json({ error: 'La respuesta de si tenes patio debe ser solo true / false !!' });
  }

  const usuario = await createUsuario(
    req.body.nombre, 
    req.body.email, 
    req.body.telefono, 
    req.body.direccion, 
    req.body.tiene_patio, 
    req.body.tiene_mas_mascotas,
  );
  if(!usuario) {
    return res.status(500).json({ error: 'Algo fallo al crear el usuario'})
  }
  res.json(usuario);
});
app.delete('/index/usuarios/:id', async (req, res) => {

    const usuario = await deleteUsuario(req.params.id);

    if (!usuario) {
      return res.status(404).json({error: 'Upsi, usuario no encontrado, no se puede eliminar'})
    }

    res.json({ status: 'OK', id: usuario });
});

//formularios
app.get('/index/formularios', async (req, res) => {
  const formularios = await getAllFormularios();
  res.json(formularios);
});
app.get('/index/formularios/:id', async (req, res) => {
  const formulario = await getOneFormulario(req.params.id);
  if (!formulario) {
    return res.status(404).json({ error: 'Upsi, formulario no encontrado :('});
  }
  res.json(formulario);
});
app.post('/index/formularios_adopcion', async (req, res) => {
  if (
    !req.body.fecha || 
    !req.body.estado || 
    !req.body.id_mascota || 
    !req.body.id_usuario || 
    !req.body.id_cuidador
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!' });
  }

  if (!(await existeEnTabla('mascotas', req.body.id_mascota))) {
    return res.status(400).json({ error: 'La mascota no existe' });
  }

  if (!(await existeEnTabla('usuarios', req.body.id_usuario))) {
    return res.status(400).json({ error: 'El usuario no existe' });
  }

  if (!(await existeEnTabla('cuidador', req.body.id_cuidador))) {
    return res.status(400).json({ error: 'El cuidador no existe' });
  }

  const formulario = await createFormulario(
    req.body.fecha, 
    req.body.estado, 
    req.body.id_mascota, 
    req.body.id_usuario, 
    req.body.id_cuidador, 
    req.body.comentario || null
  );

  if (!formulario) {
    return res.status(500).json({ error: 'Algo falló al crear el formulario' });
  }

  res.status(201).json({ formulario });
});
app.delete('/index/formularios/:id', async (req, res) => {

    const formulario = await deleteFormulario(req.params.id);

    if (!formulario) {
      return res.status(404).json({error: 'Upsi, formulario no encontrada, no se puede eliminar'})
    }

    res.json({ status: 'OK', id: formulario });
});
// PUT. /formularios/id

//cuidadores
app.get('/index/cuidadores', async (req, res) => {
  const cuidadores = await getAllCuidador();
  res.json(cuidadores);
});
app.get('/index/cuidadores/:id', async (req, res) => {
  const cuidador = await getOneCuidador(req.params.id);
  if (!cuidador) {
    return res.status(404).json({ error: 'Upsi, cuidador no encontrado :('});
  }
  res.json(formulario);
});
app.post('/index/cuidadores', async (req, res) => {

  if(!req.body.nombre || !req.body.email || !req.body.tipo || !req.body.animales_a_cargo || 
     !req.body.disponibilidad_horaria) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!'})
  }

  const emailAValidar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAValidar.test(req.body.email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!Number.isInteger(req.body.animales_a_cargo)) {
  return res.status(400).json({ error: 'El numero de animales a cargo debe ser un número entero' });
  }

  const cuidador = await createCuidador(
    req.body.nombre, 
    req.body.email, 
    req.body.tipo, 
    req.body.animales_a_cargo, 
    req.body.disponibilidad_horaria
  );
  if(!cuidador) {
    return res.status(500).json({ error: 'Algo falló al registrar al cuidador:( '})
  }
  res.json({cuidador});
});
app.delete('/index/cuidadores/:id', async (req, res) => {

    const cuidador = await deleteCuidador(req.params.id);

    if (!cuidador) {
      return res.status(404).json({error: 'Upsi, perfil de cuidador no encontrado, no se puede eliminar'})
    }

    res.json({ status: 'OK', id: cuidador });
});
// PUT. /cuidadores/id

