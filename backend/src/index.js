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
  updateMascota,
} = require('./funciones/mascotas');

const {
  getAllUsuarios,
  getOneUsuario,
  createUsuario,
  deleteUsuario,
  updateUsuario,
} = require('./funciones/usuarios');

const {
  getAllCuidador,
  getOneCuidador,
  createCuidador,
  deleteCuidador,
  updateCuidador,
} = require('./funciones/cuidadores');

const {
  getAllFormularios,
  getOneFormulario,
  createFormulario,
  deleteFormulario,
  existeEnTabla,
  updateFormulario,
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

//ordenar en carpetas y MODULARIZAR
//mascotas
app.get('/index/mascotas', async (req, res) => {
  try {
    const mascotas = await getAllMascotas();
    if (mascotas.length === 0) {
    return res.status(404).json({ error: 'No hay mascotas cargados' });
    }
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.get('/index/mascotas/:id', async (req, res) => {
  try {
    const mascota = await getOneMascota(req.params.id);
    if (!mascota) {
      return res.status(404).json({ error: 'Upsi, mascota no encontrada :(' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
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
app.post('/index/mascotas', async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).send("no se adjunto un body");
  };

  if(req.body.nombre === undefined || req.body.especie === undefined || req.body.edad_estimada === undefined || req.body.tamaño === undefined || 
     req.body.esta_vacunado === undefined || req.body.descripcion === undefined) {
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

  if (!(await existeEnTabla('cuidador', req.body.id_cuidador))) {
  return res.status(400).json({ error: 'El cuidador no existe' });
  }

  const mascota = await createMascota(
    req.body.nombre, 
    req.body.especie, 
    req.body.edad_estimada, 
    req.body.tamaño, 
    req.body.esta_vacunado, 
    req.body.imagen, 
    req.body.descripcion,
    req.body.id_cuidador
  );
  if(!mascota) {
    return res.status(500).json({ error: 'Algo falló al crear la mascota'})
  }
  res.json({mascota});
});
app.delete('/index/mascotas/:id', async (req, res) => {
  try {
      const mascota = await deleteMascota(req.params.id);

      if (!mascota) {
        return res.status(404).json({error: 'Upsi, mascota no encontrada, no se puede eliminar'})
      }

      res.json({ status: 'OK', id: mascota });

  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede borrar porque esta vinculado a un formulario de adopcion. Gestiona todas las solicitudes e intenta de nuevo.'
      }); 

    } else {
      return res.status(500).json({ error: 'Error interno al eliminar la mascota' });
    }
  }
});
app.put('/index/mascotas/:id', async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  };

  if(req.body.nombre === undefined || req.body.especie === undefined || req.body.edad_estimada === undefined || req.body.tamaño === undefined || 
     req.body.esta_vacunado === undefined || req.body.descripcion === undefined) {
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

  if (!(await existeEnTabla('cuidador', req.body.id_cuidador))) {
  return res.status(400).json({ error: 'El cuidador no existe' });
  }

  try {
    const auxMascota = await updateMascota(
    req.params.id,
    req.body.nombre,
    req.body.especie,
    req.body.edad_estimada,
    req.body.tamaño,
    req.body.esta_vacunado,
    req.body.imagen,
    req.body.descripcion,
    req.body.id_cuidador
  );

    if (!auxMascota) {
      return res.status(404).json({ error: 'Upsi, mascota no encontrada :('});
    }
    res.json(auxMascota);

    } catch (error) {
    res.status(500).json({ error: 'Hubo un error actualizando los datos' });
  }

});

//user
app.get('/index/usuarios', async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'No hay usuarios cargados' });
    }
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.get('/index/usuarios/:id', async (req, res) => {
  try {
    const usuario = await getOneUsuario(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Upsi, usuario no encontrado :(' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.post('/index/usuarios', async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  }

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
  try {
    const usuario = await deleteUsuario(req.params.id);
    if (!usuario) {
      return res.status(404).json({error: 'Upsi, usuario no encontrado, no se puede eliminar'})
    }
    res.json({ status: 'OK', id: usuario });    
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede borrar porque esta vinculado a un formulario de adopcion. Gestiona todas las solicitudes e intenta de nuevo.'
      }); 
    } else {
      return res.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }
  }
});
app.put('/index/usuarios/:id', async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  }

  if(req.body.nombre === undefined || req.body.email === undefined || req.body.telefono === undefined ||
    req.body.direccion === undefined || req.body.tiene_patio === undefined || req.body.tiene_mas_mascotas === undefined) {
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

  try {
    const auxUsuario = await updateUsuario(
      req.params.id,
      req.body.nombre,
      req.body.email,
      req.body.telefono,
      req.body.direccion,
      req.body.tiene_patio,
      req.body.tiene_mas_mascotas
    );

    if (!auxUsuario) {
      return res.status(404).json({ error: 'Upsi, usuario no encontrado :('});
    }

    res.json(auxUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error actualizando los datos' });
  }
});

//formularios
app.get('/index/formularios', async (req, res) => {
  try {
    const formularios = await getAllFormularios();
    if (formularios.length === 0) {
      return res.status(404).json({ error: 'No hay formularios cargados' });
    }
    res.json(formularios);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.get('/index/formularios/:id', async (req, res) => {
  try {
    const formulario = await getOneFormulario(req.params.id);
    if (!formulario) {
      return res.status(404).json({ error: 'Upsi, formulario no encontrado :(' });
    }
    res.json(formulario);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.post('/index/formularios', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("No se adjuntó un body");
    }

    const { fecha, estado, id_mascota, id_usuario, id_cuidador, comentario } = req.body;

    if (!fecha || !estado || !id_mascota || !id_usuario || !id_cuidador) {
      return res.status(400).json({ error: 'Faltan campos obligatorios!' });
    }

    if (!(await existeEnTabla('mascotas', id_mascota))) {
      return res.status(400).json({ error: 'La mascota no existe' });
    }
    if (!(await existeEnTabla('usuarios', id_usuario))) {
      return res.status(400).json({ error: 'El usuario no existe' });
    }
    if (!(await existeEnTabla('cuidador', id_cuidador))) {
      return res.status(400).json({ error: 'El cuidador no existe' });
    }

    const formulario = await createFormulario(
      fecha,
      estado,
      id_mascota,
      id_usuario,
      id_cuidador,
      comentario
    );

    if (!formulario) {
      return res.status(500).json({ error: 'Algo falló al crear el formulario' });
    }

    res.status(201).json({ formulario });

  } catch (error) {
    console.error("Error al crear formulario:", error);
    res.status(500).json({ error: 'Error interno al crear el formulario' });
  }
});

app.delete('/index/formularios/:id', async (req, res) => {
  const formulario = await deleteFormulario(req.params.id);

  if (!formulario) {
    return res.status(404).json({error: 'Upsi, formulario no encontrada, no se puede eliminar'})
  }

  res.json({ status: 'OK', id: formulario });    
});
app.put('/index/formularios/:id', async (req, res) => {
  console.log('Body recibido:', req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  };

  if(req.body.fecha === undefined || req.body.estado === undefined || req.body.id_mascota === undefined || 
    req.body.id_usuario === undefined || req.body.id_cuidador === undefined || req.body.comentario === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!'})
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

  try {
    const auxFormulario = await updateFormulario(
      req.body.fecha,
      req.body.estado,
      req.body.id_mascota,
      req.body.id_usuario,
      req.body.id_cuidador,
      req.body.comentario,
      req.params.id 
    );

    if (!auxFormulario) {
      return res.status(404).json({ error: 'Upsi, formulario no encontrada :('});
    }

    res.json(auxFormulario);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error actualizando los datos' });
  }
});



//cuidadores
app.get('/index/cuidadores', async (req, res) => {
  try {
    const cuidadores = await getAllCuidador();
    res.json(cuidadores);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.get('/index/cuidadores/:id', async (req, res) => {
  try {
    const cuidador = await getOneCuidador(req.params.id);
    if (!cuidador) {
      return res.status(404).json({ error: 'Upsi, cuidador no encontrado :(' });
    }
    res.json(cuidador);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en la busqueda' });
  }
});
app.post('/index/cuidadores', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  };

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
  try {
    const cuidador = await deleteCuidador(req.params.id);
    if (!cuidador) {
      return res.status(404).json({error: 'Upsi, perfil de cuidador no encontrado, no se puede eliminar'})
    }
    res.json({ status: 'OK', id: cuidador });    
  }  catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede borrar porque esta vinculado a un formulario de adopcion. Gestiona todas las solicitudes e intenta de nuevo.'
      }); 
    } else {
      return res.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }
  }
});
app.put('/index/cuidadores/:id', async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("no se adjunto un body");
  };

  if(req.body.nombre === undefined || req.body.email === undefined || req.body.tipo === undefined ||
    req.body.animales_a_cargo === undefined || req.body.disponibilidad_horaria === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios!'})
  }

  const emailAValidar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAValidar.test(req.body.email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!Number.isInteger(req.body.animales_a_cargo)) {
  return res.status(400).json({ error: 'El numero de animales a cargo debe ser un número entero' });
  }

  try {
    const auxCuidador = await updateCuidador(
      req.params.id,
      req.body.nombre,
      req.body.email,
      req.body.tipo,
      req.body.animales_a_cargo,
      req.body.disponibilidad_horaria
    );

    if (!auxCuidador) {
      return res.status(404).json({ error: 'Upsi, cuidador no encontrado :('});
    }

    res.json(auxCuidador);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error actualizando los datos' });
  }
});
