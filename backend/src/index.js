const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../frontend'));

const PORT = process.env.PORT || 3000;

// funciones
const {
    getAllMascotas,
    getOneMascota,
    createMascota,
    deleteMascota
} = require('./mascotas.js')

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
// get all
app.get('/index/mascotas', async (req, res) => {
  const mascotas = await getAllMascotas();
  res.json(mascotas);
});

//get one
app.get('/index/mascotas/:id', async (req, res) => {
  const mascota = await getOneMascota(req.params.id);
  if (!mascota) {
    return res.status(404).json({ error: 'Upsi, mascota no encontrada :('});
  }
  res.json(mascota);
});

/*
PARA PROBAR
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"nombre":"nievecita","especie":"conejito","edad_estimada":2,"tamaño":"pequeño","esta_vacunado":true,"imagen":"xyz","descripcion":"le gusta la lechuga y jugar!"}' \
  http://localhost:3000/index/mascotas
*/
//insert
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

app.put('/index/mascotas/:id', async (req, res) => {
  const mascota = await updateMascota(req.params.id);
  if (!mascota) {
    return res.status(404).json({ error: 'Upsi, mascota no encontrada :('});
  }
  res.json({ status: 'OK', id: mascota });
});

//user
// GET. /user
// // GET. /user/id
// POST. /user/id
// DELETE. /user/id
// PUT. /user/id

//formularios
// GET. /formularios
// // GET. /formularios/id
// POST. /formularios/id
// DELETE. /formularios/id
// PUT. /formularios/id

//cuidadores
// GET. /cuidadores
// // GET. /cuidadores/id
// POST. /cuidadores/id
// DELETE. /cuidadores/id
// PUT. /cuidadores/id

