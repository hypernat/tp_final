const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgress',
  host: 'localhost',
  database: 'mi_basedatos',
  password: 'password',
  port: 5432,
});

app.use(express.json());



app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
