# Sistema de Auditorías - Frontend

## 🚀 Enlaces Rápidos y Demo
- **📺 Video Explicativo:** [Ver en YouTube](https://youtu.be/SnSKTyVdA3U)
- **🌐 Frontend Deploy:** [frontendproyectoweb.vercel.app](https://frontendproyectoweb.vercel.app)
- **⚙️ Backend Deploy:** [backendproyectoweb.onrender.com](https://backendproyectoweb.onrender.com)

---


Frontend desarrollado con React + TypeScript + Vite para el sistema de gestión de auditorías empresariales.

> Este README incluye instrucciones detalladas para poner en marcha tanto el Frontend como el Back-end que lo acompaña. Para la documentación completa de la API, ver `../backend/API_DOCUMENTATION_FRONTEND.md` o el README del backend (enlace abajo).

---

## Tabla de contenidos
1. Visión general
2. Requisitos previos
3. Instalación y ejecución (Frontend)
4. Instalación y ejecución (Back-end)
5. Variables de entorno (Front & Back)
6. Flujo de autenticación y manejo de tokens
7. Estructura del proyecto y archivos importantes
8. Scripts y comandos útiles
9. Tests y calidad de código
10. Despliegue
11. Troubleshooting (problemas comunes)
12. Integración y enlace al Back-end
13. Contribuir
14. Recursos y documentación interna

---

## 1) Visión general
- **Nombre:** Sistema de Auditorías (Frontend)
- **Propósito:** Interfaz para crear y gestionar auditorías, empresas, plantillas, equipos y comparaciones. Se comunica con una API REST (Django REST) que contiene la lógica de negocio y persistencia.

> 📘 **Documentación Técnica**: Para detalles de arquitectura, diagramas y modelos de datos, ver **[DOCUMENTACION_TECNICA.md](../DOCUMENTACION_TECNICA.md)** en la raíz del proyecto.

## Funcionalidades Clave
- **Dashboard**: Vista general de métricas.
- **Auditorías**: Ejecución y reporte.
- **Recomendaciones**: Análisis inteligente de deficiencias.
- **Equipos**: Gestión de estructura organizacional.
- **Empresas**: Administración multi-sucursal.

## 2) Requisitos previos
- Node.js >= 18 (recomendado) + npm >= 9
- Python 3.10+ (para el backend)
- PostgreSQL (recomendado para producción) o SQLite para desarrollo
- Git
- Recomendado: Docker si prefieres contenerizar localmente

## 3) Instalación y ejecución (Frontend)
### Clonar repositorio
```bash
git clone https://github.com/Mundrack/frontendproyectoweb.git
cd frontend
```

### Instalar dependencias
```bash
npm install
```

### Variables de entorno (frontend)
Crea un archivo `.env` en la raíz del frontend con al menos:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Sistema de Auditorías
```
- `VITE_API_BASE_URL` debe apuntar a la URL del backend (dev por defecto `http://127.0.0.1:8000`).

### Ejecutar en modo desarrollo
```bash
npm run dev
```
- El servidor de desarrollo corre en: `http://localhost:3000`
- Vite incluye un proxy (ver `vite.config.ts`) que redirige `/api` al backend local para evitar CORS: `/api -> http://127.0.0.1:8000`.

### Build para producción
```bash
npm run build
npm run preview
```

## 4) Instalación y ejecución (Back-end)
> El Back-end se encuentra en: https://github.com/Mundrack/BackendProyectoWeb.git

Sigue estos pasos en una carpeta aparte (o en `../backend` si trabajas en monorepo local):

```bash
# clonar
git clone https://github.com/Mundrack/BackendProyectoWeb.git
cd BackendProyectoWeb

# crear y activar virtualenv
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# instalar dependencias
pip install -r requirements.txt

# configurar variables de entorno (ver sección siguiente)
# ejecutar migraciones
python manage.py migrate

# crear superuser (opcional)
python manage.py createsuperuser

# iniciar servidor
python manage.py runserver 0.0.0.0:8000
```
- API disponible en: `http://127.0.0.1:8000`
- La documentación para frontend de la API está en `API_DOCUMENTATION_FRONTEND.md` del repositorio backend.

**Notas:**
- El backend usa Django + DRF y está preparado para PostgreSQL (Supabase) en producción. Para desarrollo puedes usar SQLite sin configuraciones adicionales.
- Comprueba `audit_system/settings/development.py` / variables de entorno si usas Postgres.

## 5) Variables de Entorno (Front & Back)
### Frontend (.env)
- `VITE_API_BASE_URL` → URL base de la API (ej: `http://127.0.0.1:8000`)
- `VITE_APP_NAME` → Nombre de la aplicación (opcional)

### Backend (.env) — ejemplos recomendados
- `DJANGO_SECRET_KEY` (string)
- `DEBUG` (True/False)
- `DATABASE_URL` (postgres://user:pass@host:port/dbname) — si usas Postgres
- `ALLOWED_HOSTS` (ej: `localhost,127.0.0.1`)
- `CORS_ALLOWED_ORIGINS` (si aplica)

> Revisa `audit_system/settings/development.py` para la configuración efectiva y adapta las variables según tu entorno.

## 6) Flujo de autenticación y manejo de tokens 🔐
- El frontend utiliza Axios con interceptores en `src/api/axios.config.ts`.
- Tokens y claves en `localStorage`:
  - `access_token` (ACCESS_TOKEN)
  - `refresh_token` (REFRESH_TOKEN)
  - `user` (USER)
- Si una respuesta retorna `401`, el interceptor intenta refrescar el token mediante `/api/auth/token/refresh/` o `/api/auth/refresh/` (el backend tiene endpoints para refresh). Si el refresh falla, el frontend limpia storage y redirige a `/login`.
- Endpoints relevantes: `POST /api/auth/login/`, `POST /api/auth/register/`, `POST /api/auth/refresh/`, `GET /api/auth/me/`.

## 7) Estructura del proyecto y archivos importantes
- `src/`:
  - `api/` — `axios.config.ts`, endpoints por dominio (`auth`, `companies`, `audits`, ...)
  - `components/` — componentes UI por dominio
  - `contexts/` — `AuthContext.tsx`
  - `hooks/` — `useAuth.ts`, `useModal.ts`, `useDashboard.ts`
  - `pages/`, `routes/`, `utils/` (`constants.ts`, `formatters.ts`, `validators.ts`)
- Configs: `vite.config.ts` (proxy/puerto), `tailwind.config.js`, `tsconfig.json`, `postcss.config.js`.

## 8) Scripts y comandos útiles
- `npm run dev` → levantar dev server (Vite)
- `npm run build` → compilar producción
- `npm run preview` → servir build para previsualizar
- `npm run lint` → ejecutar ESLint (configurado para no tolerar warnings)

### Backend
- `python manage.py migrate`
- `python manage.py makemigrations`
- `python manage.py createsuperuser`
- `python manage.py runserver`
- `python manage.py test`

## 9) Tests y calidad de código
- Actualmente no hay tests de frontend en `package.json`. Para añadir testing te propongo:
  - Unit + component tests: Vitest + React Testing Library
  - E2E: Playwright o Cypress
- ESLint + TypeScript están configurados; se recomienda integrar Prettier si quieres formateo automático.

## 10) Despliegue
- Frontend: `npm run build` → servir `dist/` con Nginx, Netlify, Vercel o similar.
- Backend: desplegar en servidor con Gunicorn + Nginx o usar plataformas PaaS/Serverless; recomiendo PostgreSQL para producción.
- Asegúrate de establecer las variables de entorno en el entorno de producción.

## 11) Troubleshooting (problemas comunes) ⚠️
- 401 / Refresh Token:
  - Verifica que `VITE_API_BASE_URL` apunte al backend correcto.
  - Comprueba que el endpoint de refresh coincide entre frontend y backend (`/api/auth/refresh/` vs `/api/auth/token/refresh/`).
  - Revisa `SOLUCION_ERROR_401.md` en este repo para pasos rápidos.
- CORS:
  - Si el backend no permite el origen del frontend, configura `CORS_ALLOWED_ORIGINS` o usa el proxy de Vite en dev.
- Proxy Vite:
  - Si `vite.config.ts` está presente, `/api` se proxea al host configurado; si cambias el backend, actualiza el proxy o `.env`.
- Errores de migraciones:
  - Ejecuta `python manage.py makemigrations` y `migrate` y revisa `django_migrations`.

## 12) Integración y enlace al Back-end 🔗
- Repositorio Back-end (API): https://github.com/Mundrack/BackendProyectoWeb.git
- Documentos relevantes en el backend:
  - `API_DOCUMENTATION_FRONTEND.md` — Endpoints, ejemplos de petición/respuesta y contratos que consume el frontend.
- **Recomendación:** añadir en el README del backend un `CHANGELOG.md` y en el frontend dejar una referencia a la versión de la API con la que se probó (ej: `API v1.0.0`).

## 13) Contribuir
- Abrir issues para bugs y features.
- Crear PR por feature/bug con descripción, capturas y pasos de prueba.
- Mantener `main` estable; usar ramas por feature.

## 14) Recursos y documentación interna
- `FASE2_IMPLEMENTACION.md`
- `INSTRUCCIONES_DESARROLLO.md`
- `SOLUCION_ERROR_401.md`
- `API_DOCUMENTATION_FRONTEND.md` (en el repo backend)

---

Si quieres, puedo:
- 1) aplicar este contenido directamente al archivo `frontend/README.md` (ya lo actualicé),
- 2) crear una copia de respaldo `README.backup.md`,
- 3) generar el archivo de especificaciones técnicas más detallado que pediste (documentación extensa con diagramas, endpoints, ejemplos de peticiones, modelos, y secuencias) — dime si prefieres que lo haga en Markdown (`SPECIFICATIONS.md`) o en otro formato.

¿Quieres que haga la copia de respaldo y que continúe a crear el archivo de especificaciones detallado ahora?
