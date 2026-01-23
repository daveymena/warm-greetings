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
  - `DATABASE_URL`: `postgresql://usuario:password@db-host:5432/rapi_credi?sslmode=require`
  - `JWT_SECRET`: `rapi_credi_secret_key_2024`
  - `USE_LLM`: `true`
  - `OLLAMA_BASE_URL`: `https://ollama-ollama.ginee6.easypanel.host`
  - `OLLAMA_MODEL`: `llama3.2:1b`
  - `WA_SESSION_NAME`: `rapi-credi-production`
  - `NODE_ENV`: `production`
  - `PORT`: `5000`

> **Nota**: El backend ejecutará automáticamente `npx prisma generate` y la inicialización de la base de datos al iniciar.

---

## 3. Servicio: Frontend
Muestra la interfaz de usuario.

- **Tipo**: App (GitHub/Git)
- **Nombre**: `frontend` (o el que prefieras).
- **Ruta de Construcción (Build Path)**: `.` (Raíz del proyecto)
- **Puerto**: `80`
- **Variables de Entorno**:
  - `VITE_API_URL`: `/api`

---

## Solución de Problemas

### Error: host not found in upstream "backend"
He actualizado la configuración de Nginx para manejar esto. Si sucede, asegúrate de que el backend esté encendido. Si el nombre del servicio no es `backend`, cámbialo en la configuración del servicio en Easypanel.

### Conexión a Base de Datos
Asegúrate de que la `DATABASE_URL` sea accesible desde el servidor donde corre Easypanel. Si usas una base de datos interna de Easypanel, usa el nombre del servicio (ej: `postgres:5432`).
