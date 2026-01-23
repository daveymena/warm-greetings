# Guía de Despliegue en Easypanel: Rapi-Credi

Para que el frontend y el backend funcionen correctamente en Easypanel, debes configurar **dos servicios** dentro del mismo Proyecto.

## 1. Crear el Proyecto
Crea un proyecto en Easypanel llamado `rapi-credi`.

---

## 2. Servicio: Backend (Crear primero)
Este servicio maneja la base de datos y la lógica.

- **Tipo**: App (GitHub/Git)
- **Nombre**: `backend` (⚠️ **IMPORTANTE**: Debe llamarse así exactamente).
- **Ruta de Construcción (Build Path)**: `./server`
- **Puerto**: `5000`
- **Variables de Entorno**:
  - `PORT`: `5000`
  - `DATABASE_URL`: `postgresql://usuario:password@host:puerto/dbname`
  - `JWT_SECRET`: `una-clave-muy-segura`
  - `USE_LLM`: `true` (opcional para IA)
  - `NODE_ENV`: `production`

> **Nota**: El backend ejecutará automáticamente `npx prisma generate` y la inicialización de la base de datos al iniciar.

---

## 3. Servicio: Frontend
Muestra la interfaz de usuario.

- **Tipo**: App (GitHub/Git)
- **Nombre**: `frontend` (o el que prefieras).
- **Ruta de Construcción (Build Path)**: `.` (Raíz del proyecto)
- **Puerto**: `80`
- **Variables de Entorno**:
  - `VITE_API_URL`: `/api` (Esto permite que Nginx haga el proxy interno).

### ¿Cómo se comunican?
El frontend usa un archivo `nginx.conf` que redirige todas las llamadas a `/api/*` hacia `http://backend:5000/api/*`. Por eso es vital que el backend se llame exactamente `backend`.

---

## Solución de Problemas

### Pantalla en blanco o Error 502
1. **Nombre del servicio**: Confirma que el backend se llama `backend`.
2. **Logs del Frontend**: Si ves un error de "host not found", el frontend no está encontrando al backend en la red interna de Docker.
3. **Logs del Backend**: Si el backend falla, revisa que la `DATABASE_URL` sea correcta y accesible.

### Base de Datos
El sistema está diseñado para conectarse a **PostgreSQL**. Asegúrate de tener una base de datos lista antes de desplegar el backend.
