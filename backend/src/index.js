const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// funciones
const {
    getAllMascotas,
    getOneMascota,
} = require('./db.js')

// ruta health
app.get('/index/health', (req, res) => {
  res.json({ status: 'todo ok por aca' });
});

app.listen(PORT, () => {
  console.log("Servidor backend escuchando en PORT",PORT);
});


//ordenar en carpetas

//mascotas
// get all
app.get('/index/mascotas', async (req, res) => {
  const mascotas = await getAllMascotas();
  res.json(mascotas);
});

app.get('/index/mascotas/:id', async (req, res) => {
  const mascota = await getOneMascota(req.params.id);
  res.json(mascota);
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

