# Backend UPB

API REST en Express con PostgreSQL y un acceso de demostración configurable mediante variables de entorno.

## Ejecución local

1. Copia `.env.example` como `.env` y reemplaza sus valores.
2. Instala dependencias con `npm install`.
3. Inicia la API con `npm run dev`.

La API queda disponible en `http://localhost:3000`. El frontend usa `POST /api/auth/login` con este cuerpo:

```json
{
  "email": "estudiante@upb.edu",
  "password": "tu-contraseña"
}
```

## Comandos

- `npm run lint`: valida la sintaxis.
- `npm test`: ejecuta las pruebas.
- `npm run build`: valida que el código pueda desplegarse.
- `npm start`: inicia el servidor en producción.

No publiques el archivo `.env` ni credenciales reales en Git.

## Despliegue en Render

El servicio de producción utiliza:

- Build command: `npm ci && npm test`
- Start command: `npm start`
- Health check path: `/api/health`

Render está conectado a la rama `main` y despliega automáticamente después de
cada actualización. GitHub Actions valida lint, pruebas y build.

Variables requeridas en Render: `DATABASE_URL`, `DB_SSL`, `JWT_SECRET`,
`DEMO_EMAIL`, `DEMO_PASSWORD`, `DEMO_NAME` y `CORS_ORIGINS`. Los valores
secretos se configuran en el Dashboard y nunca se guardan en Git.
