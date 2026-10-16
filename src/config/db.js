require('dotenv').config();
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL?.trim();
const useSsl = process.env.DB_SSL === 'true' ||
    (databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1'));

const config = databaseUrl
    ? { connectionString: databaseUrl }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    };

const pool = new Pool({
    ...config,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
});

pool.on('error', (error) => {
    console.error('Error inesperado de PostgreSQL:', error.message);
});

module.exports = pool;
