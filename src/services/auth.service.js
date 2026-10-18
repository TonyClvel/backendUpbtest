const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const HttpError = require('../utils/http-error');

const compararSeguro = (recibido, esperado) => {
    const recibidoBuffer = Buffer.from(recibido);
    const esperadoBuffer = Buffer.from(esperado);

    return recibidoBuffer.length === esperadoBuffer.length &&
        crypto.timingSafeEqual(recibidoBuffer, esperadoBuffer);
};

const login = (body = {}) => {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
        throw new HttpError(400, 'El correo y la contraseña son obligatorios');
    }

    const emailConfigurado = process.env.DEMO_EMAIL?.trim().toLowerCase();
    const passwordConfigurado = process.env.DEMO_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!emailConfigurado || !passwordConfigurado || !jwtSecret) {
        throw new HttpError(503, 'El acceso de demostración no está configurado');
    }

    if (!compararSeguro(email, emailConfigurado) || !compararSeguro(password, passwordConfigurado)) {
        throw new HttpError(401, 'Correo o contraseña incorrectos');
    }

    const nombre = process.env.DEMO_NAME?.trim() || 'Usuario demo';
    const token = jwt.sign({ sub: emailConfigurado, name: nombre }, jwtSecret, { expiresIn: '1h' });

    return {
        token,
        expiresIn: 3600,
        user: { email: emailConfigurado, name: nombre },
    };
};

module.exports = { login };
