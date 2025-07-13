const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',       // porque tu backend corre localmente
    database: 'pethub',
    password: 'password123',
    port: 5433,              // puerto mapeado para acceder a PostgreSQL en Docker
  });