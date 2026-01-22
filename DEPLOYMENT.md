# Guía de Despliegue en Easypanel - Rapi Crédito

## 📋 Resumen

Esta aplicación está completamente configurada para desplegarse en Easypanel con PostgreSQL. La aplicación incluye:

- **Backend**: Node.js + Express + TypeScript + Prisma
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Base de datos**: PostgreSQL (ya configurada en Easypanel)

## 🗄️ Configuración de Base de Datos

### Credenciales PostgreSQL (Ya configuradas)
```
Host interno: ollama_rapi-credi:5432
Host externo: 164.68.122.5:5435
Usuario: postgres
Contraseña: 6715320D
Base de datos: posgres-db
```

### Usuario Administrador por Defecto
```
Email: admin@rapicredito.com
Contraseña: admin123
```

## 🚀 Pasos para Desplegar en Easypanel

### 1. Crear Servicio Backend

1. En Easypanel, crear un nuevo servicio
2. Seleccionar "Source Code" como tipo
3. Configurar:
   - **Name**: `rapi-credi-backend`
   - **Source**: Tu repositorio Git
   - **Build Path**: `./server`
   - **Port**: `5000`

4. Variables de entorno:
```env
PORT=5000
JWT_SECRET=rapi_credi_secret_key_2024
DATABASE_URL=postgresql://postgres:6715320D@ollama_rapi-credi:5432/posgres-db?sslmode=disable
```

### 2. Crear Servicio Frontend

1. Crear otro servicio en Easypanel
2. Configurar:
   - **Name**: `rapi-credi-frontend`
   - **Source**: Tu repositorio Git
   - **Build Path**: `./`
   - **Port**: `80`

3. Variables de entorno:
```env
VITE_API_URL=/api
```

### 3. Configurar Proxy (Opcional)

Si quieres que ambos servicios estén bajo el mismo dominio, configura el frontend para hacer proxy al backend usando la configuración de Nginx incluida.

## 🔧 Comandos de Desarrollo Local

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

### Inicializar Base de Datos
```bash
cd server
node init-db.js
```

## 🐳 Docker Compose (Alternativo)

Si prefieres usar Docker Compose:

```bash
docker-compose up --build
```

## 📊 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Préstamos
- `GET /api/loans` - Obtener préstamos
- `POST /api/loans` - Crear préstamo

### Usuarios
- `GET /api/users` - Obtener usuarios (Admin)

### Health Check
- `GET /health` - Estado del servidor

## 🔍 Verificación del Despliegue

1. **Backend Health Check**: `https://tu-backend.easypanel.app/health`
2. **Frontend**: `https://tu-frontend.easypanel.app`
3. **Login de prueba**: Usar las credenciales del admin por defecto

## 🛠️ Solución de Problemas

### Error de Conexión a Base de Datos
- Verificar que las credenciales en `DATABASE_URL` sean correctas
- Asegurar que el servicio PostgreSQL esté ejecutándose
- Revisar los logs del contenedor backend

### Error 404 en API
- Verificar que el proxy de Nginx esté configurado correctamente
- Confirmar que `VITE_API_URL` apunte al backend correcto

### Error de CORS
- El backend ya incluye configuración CORS para todos los orígenes
- Si persiste, verificar la configuración de red en Easypanel

## 📝 Notas Importantes

1. **Seguridad**: Cambiar `JWT_SECRET` en producción
2. **Base de datos**: Las tablas se crean automáticamente al iniciar el backend
3. **Usuario admin**: Se crea automáticamente si no existe
4. **Logs**: Revisar logs de contenedores para debugging

## 🔄 Actualizaciones

Para actualizar la aplicación:
1. Hacer push de los cambios al repositorio
2. En Easypanel, hacer rebuild de los servicios
3. Los servicios se reiniciarán automáticamente

## 📞 Soporte

Si encuentras problemas durante el despliegue, revisa:
1. Logs de los contenedores en Easypanel
2. Estado de la base de datos PostgreSQL
3. Configuración de variables de entorno

## 🏗️ Estructura del Proyecto

```
rapi-credi/
├── server/                 # Backend (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── index.ts       # Punto de entrada
│   │   ├── routes/        # Rutas de la API
│   │   └── middleware/    # Middlewares
│   ├── prisma/
│   │   └── schema.prisma  # Esquema de la base de datos
│   ├── Dockerfile         # Docker para backend
│   ├── init-db.js         # Script de inicialización de BD
│   └── start.sh           # Script de inicio
├── src/                   # Frontend (React + Vite)
├── Dockerfile             # Docker para frontend
├── nginx.conf             # Configuración de Nginx
└── docker-compose.yml     # Para desarrollo local
```
