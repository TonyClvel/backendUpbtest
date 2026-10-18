require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/producto.routes');
const authRoutes = require('./routes/auth.routes');
const inicializarBaseDeDatos = require('./db/init');

const app = express();

const origenesPermitidos = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);

app.use(cors({
    origin(origen, callback) {
        if (!origen || origenesPermitidos.length === 0 || origenesPermitidos.includes(origen)) {
            return callback(null, true);
        }
        const error = new Error('Origen no permitido por CORS');
        error.status = 403;
        return callback(error);
    },
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API backendUpb funcionando');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores: HttpError usa su status, cualquier otro error es 500
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', '57P01', '57P03'].includes(err.code)) {
        console.error('Base de datos no disponible:', err.message);
        return res.status(503).json({ error: 'Base de datos no disponible' });
    }
    if (err.code === '23505') {
        return res.status(409).json({ error: 'El producto ya existe' });
    }
    if (['22003', '22P02', '23502', '23514'].includes(err.code)) {
        return res.status(400).json({ error: 'Los datos enviados no son válidos' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;

const iniciar = async () => {
    try {
        await inicializarBaseDeDatos();
        console.log('Base de datos inicializada');
    } catch (error) {
        console.error('No se pudo inicializar PostgreSQL:', error.message);
    }

    return app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

if (require.main === module) iniciar();

module.exports = { app, iniciar };
