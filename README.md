# RapiCrédito - Sistema de Gestión de Préstamos

## 🚀 Descripción

RapiCrédito es una aplicación web completa para la gestión profesional de préstamos y microcréditos. Diseñada para empresas financieras que necesitan una solución robusta, segura y fácil de usar.

## ✨ Características Principales

### 🏠 Landing Page Profesional
- Página de inicio atractiva y moderna
- Información clara sobre servicios
- Planes de financiamiento
- Testimonios de clientes
- Formulario de contacto

### 👤 Sistema de Usuarios
- Registro e inicio de sesión seguro
- El primer usuario registrado se convierte automáticamente en administrador
- Roles y permisos diferenciados
- Autenticación JWT

### 📊 Dashboard Inteligente
- Métricas en tiempo real
- Estadísticas de préstamos
- Gráficos y reportes visuales
- Accesos rápidos a funciones principales

### 💰 Gestión de Préstamos
- Crear y gestionar préstamos
- Estados: Pendiente, Aprobado, Rechazado, Pagado
- Cálculo automático de intereses
- Seguimiento de pagos

### 👥 Gestión de Clientes
- Base de datos completa de clientes
- Historial crediticio
- Información de contacto
- Estados de cuenta

### 💳 Control de Pagos
- Registro de pagos
- Recordatorios automáticos
- Control de vencimientos
- Reportes de cobranza

### ⚙️ Configuración Avanzada
- Personalización de la empresa
- Configuración de tasas de interés
- Límites de préstamos
- Notificaciones personalizables

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes
- **React Router** para navegación
- **React Query** para manejo de estado
- **Sonner** para notificaciones

### Backend
- **Node.js** con Express
- **TypeScript** para tipado fuerte
- **Prisma** como ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **bcryptjs** para encriptación

### Infraestructura
- **Docker** para contenedores
- **Nginx** como proxy reverso
- **PostgreSQL** en Easypanel
- Despliegue en **Easypanel**

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- npm o yarn

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd rapi-credito
```

2. **Instalar dependencias del frontend**
```bash
npm install
```

3. **Instalar dependencias del backend**
```bash
cd server
npm install
```

4. **Configurar variables de entorno**
```bash
# En server/.env
PORT=5000
JWT_SECRET=tu_jwt_secret_muy_seguro
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos"
```

5. **Inicializar la base de datos**
```bash
cd server
node init-db.js
```

6. **Ejecutar en desarrollo**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Despliegue en Producción

Ver el archivo `DEPLOYMENT.md` para instrucciones detalladas de despliegue en Easypanel.

## 📱 Uso de la Aplicación

### Primer Uso
1. Accede a la aplicación
2. Regístrate como primer usuario (serás administrador automáticamente)
3. Configura tu empresa en Configuración
4. Comienza a crear préstamos y gestionar clientes

### Funciones Principales
- **Dashboard**: Vista general de tu negocio
- **Préstamos**: Crear y gestionar préstamos
- **Clientes**: Administrar base de datos de clientes
- **Cobros**: Control de pagos y vencimientos
- **Configuración**: Personalizar la aplicación

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT con tokens seguros
- Validación de datos en frontend y backend
- Protección contra inyección SQL con Prisma
- Headers de seguridad configurados

## 📊 Características del Negocio

### Métricas Disponibles
- Capital total prestado
- Préstamos activos
- Clientes registrados
- Tasas de aprobación
- Cartera vencida

### Reportes
- Préstamos por estado
- Clientes más activos
- Ingresos por período
- Análisis de riesgo

## 🌐 URLs de Acceso

### Desarrollo Local
- **Frontend**: http://localhost:8083
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Producción
- **Aplicación**: https://tu-dominio.easypanel.app
- **API**: https://tu-api.easypanel.app

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@rapicredito.com
- Documentación: Ver archivos en `/docs`
- Issues: Crear un issue en GitHub

## 🔄 Actualizaciones

### Versión 1.0.0
- ✅ Landing page profesional
- ✅ Sistema de autenticación completo
- ✅ Dashboard con métricas reales
- ✅ Gestión completa de préstamos
- ✅ Base de datos PostgreSQL
- ✅ Despliegue en Easypanel
- ✅ Configuración personalizable

### Próximas Funciones
- 📧 Notificaciones por email
- 📱 Notificaciones SMS
- 📊 Reportes avanzados
- 🔄 Sincronización móvil
- 🤖 Automatización de cobranza

---

**RapiCrédito** - Soluciones financieras profesionales para tu negocio 💼