const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.DEMO_EMAIL = 'estudiante@upb.edu';
process.env.DEMO_PASSWORD = 'contrasena-segura';
process.env.DEMO_NAME = 'Estudiante de prueba';
process.env.JWT_SECRET = 'secreto-de-prueba-con-longitud-suficiente';

const { app } = require('../src/app');

test('GET /api/health informa que la API está disponible', async () => {
    const respuesta = await request(app).get('/api/health');

    assert.equal(respuesta.status, 200);
    assert.deepEqual(respuesta.body, { status: 'ok' });
});

test('POST /api/auth/login devuelve una sesión con credenciales válidas', async () => {
    const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ESTUDIANTE@UPB.EDU', password: 'contrasena-segura' });

    assert.equal(respuesta.status, 200);
    assert.equal(typeof respuesta.body.token, 'string');
    assert.deepEqual(respuesta.body.user, {
        email: 'estudiante@upb.edu',
        name: 'Estudiante de prueba',
    });
});

test('POST /api/auth/login rechaza credenciales incorrectas', async () => {
    const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ email: 'estudiante@upb.edu', password: 'incorrecta' });

    assert.equal(respuesta.status, 401);
    assert.deepEqual(respuesta.body, { error: 'Correo o contraseña incorrectos' });
});

test('POST /api/auth/login valida los campos obligatorios', async () => {
    const respuesta = await request(app).post('/api/auth/login').send({});

    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body, { error: 'El correo y la contraseña son obligatorios' });
});
