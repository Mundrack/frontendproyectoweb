# Sistema de Auditorías - Frontend

Frontend desarrollado con React + TypeScript + Vite para el sistema de gestión de auditorías empresariales.

## Stack Tecnológico

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (iconos)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── api/              # Configuración de Axios y endpoints
├── components/       # Componentes reutilizables
├── contexts/         # Contexts de React
├── hooks/            # Custom hooks
├── pages/            # Páginas principales
├── routes/           # Configuración de rutas
├── types/            # TypeScript types
└── utils/            # Utilidades y constantes
```

## Variables de Entorno

Crea un archivo `.env` en la raíz con:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Sistema de Auditorías
```

## Características Implementadas - FASE 1

✅ Setup completo del proyecto
✅ Configuración de Tailwind CSS
✅ Sistema de autenticación (Login/Register)
✅ Context API para manejo de estado
✅ Interceptores de Axios para tokens JWT
✅ Rutas protegidas
✅ Componentes reutilizables (Button, Input, Card, Alert, Spinner)
✅ Layouts responsive
✅ Manejo de errores
✅ UI/UX profesional

## Flujo de Pruebas

### 1. Registro de Usuario
1. Ir a http://localhost:3000/register
2. Llenar el formulario
3. Click en "Crear Cuenta"

### 2. Login
1. Ir a http://localhost:3000/login
2. Ingresar credenciales
3. Click en "Iniciar Sesión"

### 3. Dashboard
1. Acceder al dashboard después del login
2. Ver estadísticas y próximas funcionalidades

## Próximas Fases

- **FASE 2**: Gestión de Empresas y Sucursales
- **FASE 3**: Plantillas de Auditoría
- **FASE 4**: Ejecución de Auditorías
- **FASE 5**: Dashboard con Estadísticas
- **FASE 6**: Comparaciones y Recomendaciones
- **FASE 7**: Equipos y Jerarquía
