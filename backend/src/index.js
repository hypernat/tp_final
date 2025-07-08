//import { Client } from 'pg'
//conexion a db
const { Client } = require("pg");

const dbClient = new Client({
  user: 'postgres',
  password: 'password123',
  host: 'localhost',
  port: 5432,
  database: 'pethub',
})


// continuacion api

const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/index/health',(req, res) => {
  res.json({ status: 'OK' });
});


app.listen(PORT, () => {
  console.log("Servidor backend escuchando en PORT",PORT);
});

//ordenar en carpetas

//mascotas
// GET. /mascotas
// GET. /mascotas/id
// POST. /mascotas/id
// DELETE. /mascotas/id
// PUT. /mascotas/id


//user
// GET. /user
// GET. /user/id
// POST. /user/id
// DELETE. /user/id
// PUT. /user/id

//formularios
// GET. /formularios
// GET. /formularios/id
// POST. /formularios/id
// DELETE. /formularios/id
// PUT. /formularios/id

//cuidadores
// GET. /cuidadores
// GET. /cuidadores/id
// POST. /cuidadores/id
// DELETE. /cuidadores/id
// PUT. /cuidadores/id

