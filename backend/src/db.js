const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: process.env.DB_HOST || 'localhost',       // NATI: porfi no borrar variables de entorno
    database: 'pethub',                             // pq se rompe todo en docker
    password: 'password123',
    port: process.env.DB_PORT || 5433,
  });

module.exports = pool;