require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const inicializarBaseDeDatos = () => pool.query(sql);

if (require.main === module) {
    inicializarBaseDeDatos()
        .then(() => console.log('Tabla "productos" lista'))
        .catch((err) => {
            console.error('Error al inicializar la base de datos:', err.message);
            process.exitCode = 1;
        })
        .finally(() => pool.end());
}

module.exports = inicializarBaseDeDatos;
