# 🚀 Instrucciones de Desarrollo

## Problema de CORS Solucionado ✅

El error de CORS que estabas experimentando ha sido resuelto. Actualicé la configuración del backend para permitir peticiones desde el frontend.

### Cambios Realizados en Backend

**Archivo**: `backend/audit_system/settings/base.py`

```python
# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",   # ✅ AGREGADO
    "http://127.0.0.1:3000",   # ✅ AGREGADO
    "http://localhost:3001",   # ✅ AGREGADO
    "http://127.0.0.1:3001",   # ✅ AGREGADO
]
CORS_ALLOW_CREDENTIALS = True
```

## 🔧 Configuración de Puertos

- **Frontend**: Puerto 3000 (configurado en `vite.config.ts`)
- **Backend**: Puerto 8000 (por defecto de Django)

## 📝 Pasos para Iniciar el Sistema

### 1. Iniciar el Backend (Django)

```bash
# En una terminal, navega a la carpeta backend
cd backend

# Activa el entorno virtual (si no está activado)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Inicia el servidor
python manage.py runserver
```

El backend estará disponible en: **http://127.0.0.1:8000**

### 2. Iniciar el Frontend (React + Vite)

```bash
# En OTRA terminal, navega a la carpeta frontend
cd frontend

# Inicia el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## ✅ Verificar que Todo Funciona

1. Abre tu navegador en **http://localhost:3000**
2. Deberías ver la página de Login
3. Registra un nuevo usuario como "Owner"
4. Inicia sesión
5. Navega a **Empresas** desde el menú
6. Crea tu primera empresa

## 🔍 Características Disponibles

### Módulos Implementados

✅ **Autenticación** (Fase 1)
- Registro de usuarios (Owner/Employee)
- Login con JWT
- Protección de rutas

✅ **Gestión de Empresas** (Fase 2)
- CRUD de Empresas
- CRUD de Sucursales
- CRUD de Departamentos
- Navegación jerárquica
- Modales y confirmaciones

### Rutas del Frontend

```
/login                  - Iniciar sesión
/register              - Registrarse
/dashboard             - Dashboard principal
/companies             - Listado de empresas
/companies/:id         - Detalle de empresa con sucursales
/branches              - Todas las sucursales
/departments           - Todos los departamentos
```

### Endpoints del Backend

```
POST   /api/auth/register/        - Registro
POST   /api/auth/login/           - Login
POST   /api/auth/refresh/         - Refrescar token
POST   /api/auth/logout/          - Logout

GET    /api/companies/            - Listar empresas
POST   /api/companies/            - Crear empresa
GET    /api/companies/:id/        - Obtener empresa
PUT    /api/companies/:id/        - Actualizar empresa
DELETE /api/companies/:id/        - Eliminar empresa

GET    /api/branches/             - Listar sucursales
POST   /api/branches/             - Crear sucursal
GET    /api/branches/:id/         - Obtener sucursal
PUT    /api/branches/:id/         - Actualizar sucursal
DELETE /api/branches/:id/         - Eliminar sucursal

GET    /api/departments/          - Listar departamentos
POST   /api/departments/          - Crear departamento
GET    /api/departments/:id/      - Obtener departamento
PUT    /api/departments/:id/      - Actualizar departamento
DELETE /api/departments/:id/      - Eliminar departamento
```

## 🐛 Solución de Problemas

### Error de CORS

Si sigues viendo errores de CORS:

1. **Reinicia el backend Django** (presiona Ctrl+C y ejecuta `python manage.py runserver` nuevamente)
2. **Limpia la caché del navegador** (Ctrl+Shift+Del)
3. Verifica que el backend esté corriendo en el puerto 8000
4. Verifica que el frontend esté corriendo en el puerto 3000

### Error de Conexión

Si ves "Network Error" o "Failed to fetch":

1. Verifica que el **backend esté corriendo** en http://127.0.0.1:8000
2. Prueba acceder directamente: http://127.0.0.1:8000/api/companies/
3. Si ves un error de autenticación, es normal (esa ruta requiere login)

### Error de Base de Datos

Si el backend muestra errores de base de datos:

```bash
# Ejecuta las migraciones
cd backend
python manage.py migrate
```

### Puerto 3000 Ocupado

Si el puerto 3000 está ocupado, Vite te preguntará si quieres usar otro puerto. Di que sí y actualiza la configuración de CORS en el backend para incluir ese nuevo puerto.

## 📚 Variables de Entorno

### Frontend (.env)

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Sistema de Auditorías
```

### Backend (.env)

```env
SECRET_KEY=tu-clave-secreta-aqui
DJANGO_SETTINGS_MODULE=audit_system.settings.development
```

## 🎯 Flujo de Trabajo Recomendado

1. **Inicia el backend primero**
2. **Luego inicia el frontend**
3. **Abre el navegador** en http://localhost:3000
4. **Registra un usuario** tipo Owner
5. **Crea una empresa**
6. **Crea sucursales** para la empresa
7. **Crea departamentos** para las sucursales

## 📊 Estado del Proyecto

- ✅ **Backend**: API REST completamente funcional con Django + DRF
- ✅ **Frontend**: React + TypeScript + Vite funcionando
- ✅ **CORS**: Configurado correctamente
- ✅ **Autenticación**: JWT implementado
- ✅ **Gestión de Empresas**: CRUD completo

## 🚀 Próximos Pasos (Fase 3)

1. Sistema de Equipos (asignar empleados)
2. Plantillas de Auditoría (formularios dinámicos)
3. Gestión de Auditorías
4. Dashboard con Analytics
5. Comparación de Auditorías

## 💡 Consejos

- Usa **Chrome DevTools** (F12) para ver las peticiones de red
- Revisa la **consola del navegador** para ver errores de JavaScript
- Revisa la **terminal del backend** para ver errores de Django
- Usa **Redux DevTools** si necesitas debuggear el estado (lo implementaremos después)

## 📞 Comandos Útiles

```bash
# Frontend
npm run dev          # Desarrollo
npm run build        # Compilar producción
npm run preview      # Preview de producción

# Backend
python manage.py runserver              # Iniciar servidor
python manage.py makemigrations         # Crear migraciones
python manage.py migrate                # Aplicar migraciones
python manage.py createsuperuser        # Crear admin
python manage.py shell                  # Shell interactivo
```

---

**¡Todo está listo para desarrollar!** 🎉

Si tienes algún problema, revisa esta guía o las terminales del frontend y backend para ver los mensajes de error.
