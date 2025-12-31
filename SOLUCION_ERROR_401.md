# 🔧 Solución al Error 401 (Unauthorized)

## Problema Identificado

Había **dos problemas** que causaban el error 401:

### 1. Ruta de Refresh Token Incorrecta ✅ SOLUCIONADO

**Error**: El frontend intentaba refrescar el token en `/api/auth/refresh/`
**Backend esperaba**: `/api/auth/token/refresh/`

**Solución**: Actualicé `src/api/axios.config.ts` línea 41

```typescript
// ANTES (INCORRECTO)
const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {

// DESPUÉS (CORRECTO)
const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
```

### 2. Token Expirado

Si tu token JWT ya expiró, necesitas hacer login nuevamente.

## 🚀 Solución Rápida

### Opción 1: Limpiar Storage y Re-login

1. **Abre DevTools** (F12)
2. **Ve a Application → Local Storage → http://localhost:3000**
3. **Elimina estos items**:
   - `access_token`
   - `refresh_token`
   - `user`
4. **Recarga la página** (F5)
5. **Haz login nuevamente**

### Opción 2: Usar la Consola del Navegador

Ejecuta esto en la consola del navegador (F12 → Console):

```javascript
// Limpiar todo el localStorage
localStorage.clear();

// Recargar la página
location.reload();
```

## 🔍 Verificar que Funciona

Después de hacer login, verifica en la consola del navegador:

```javascript
// Deberías ver estos valores
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
console.log('User:', localStorage.getItem('user'));
```

**Si ves valores**, tu autenticación está funcionando correctamente.

## 📊 Debug Mode Activado

Ahora el frontend tiene logging adicional. En la consola verás:

- ✅ `🔑 Token agregado a la petición: /api/companies/` - Token enviado correctamente
- ⚠️ `⚠️ No hay token disponible para: /api/companies/` - No hay token (necesitas login)

## 🔐 Flujo de Autenticación

### Login Exitoso
```
1. Usuario ingresa credenciales
2. POST /api/auth/login/
3. Backend retorna: { access, refresh, user }
4. Frontend guarda en localStorage
5. Siguiente petición incluye: Authorization: Bearer <token>
```

### Token Expirado (Auto-refresh)
```
1. Petición con token expirado → 401
2. Frontend detecta 401
3. POST /api/auth/token/refresh/ con refresh token
4. Backend retorna nuevo access token
5. Frontend reintenta petición original con nuevo token
```

### Refresh Fallido (Token inválido)
```
1. Refresh token también expirado/inválido
2. Frontend limpia localStorage
3. Redirige a /login
4. Usuario debe loguearse nuevamente
```

## 🧪 Probar el Sistema

### 1. Hacer Login

```bash
# Frontend debe estar corriendo en puerto 3000
npm run dev
```

1. Abre http://localhost:3000
2. Si te redirige a login, **perfecto** (es porque no tienes token)
3. Registra un nuevo usuario o usa uno existente
4. Tipo de usuario: **Owner**

### 2. Verificar Token en Peticiones

En DevTools (F12) → Network:

1. Navega a `/companies`
2. Busca la petición a `http://127.0.0.1:8000/api/companies/`
3. En **Request Headers** deberías ver:
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

### 3. Crear una Empresa

Si puedes crear una empresa exitosamente, **¡TODO FUNCIONA!** ✅

## 🐛 Si Persiste el Error 401

### Verificar Backend

```bash
cd backend
python manage.py runserver
```

Accede directamente: http://127.0.0.1:8000/api/companies/

Deberías ver:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

Esto es **CORRECTO** - significa que el endpoint requiere autenticación.

### Verificar Token en Backend

En Django shell:

```bash
python manage.py shell
```

```python
from rest_framework_simplejwt.tokens import AccessToken

# Copia tu token del localStorage
token_string = "TU_TOKEN_AQUI"

try:
    token = AccessToken(token_string)
    print("✅ Token válido")
    print(f"User ID: {token['user_id']}")
except Exception as e:
    print(f"❌ Token inválido: {e}")
```

### Verificar Configuración CORS

En `backend/audit_system/settings/base.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",   # ✅ Tu puerto
    "http://127.0.0.1:3000",   # ✅ Tu puerto
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
```

## 📝 Datos de Prueba

Para testing rápido:

**Usuario Owner:**
```
Email: admin@test.com
Password: Admin123!
```

**O crea uno nuevo:**
```
Nombre: Test
Apellido: Owner
Email: test@owner.com
Password: Test123456!
Tipo: Owner
```

## 🎯 Checklist de Verificación

- [ ] Backend corriendo en http://127.0.0.1:8000
- [ ] Frontend corriendo en http://localhost:3000
- [ ] CORS configurado con puerto 3000
- [ ] `src/api/axios.config.ts` actualizado (ruta `/api/auth/token/refresh/`)
- [ ] localStorage limpio (sin tokens expirados)
- [ ] Usuario registrado como Owner
- [ ] Login exitoso
- [ ] Token visible en localStorage
- [ ] Peticiones a `/api/companies/` con header Authorization
- [ ] Respuesta 200 OK (no 401)

## 💡 Consejos

1. **Siempre inicia el backend PRIMERO**
2. **Luego inicia el frontend**
3. **Limpia localStorage si cambias el backend**
4. **Revisa la consola del navegador** para ver los logs
5. **Revisa Network en DevTools** para ver las peticiones

## 🔄 Si Nada Funciona

Reinicia todo desde cero:

```bash
# 1. Detén frontend y backend (Ctrl+C en ambas terminales)

# 2. Backend
cd backend
python manage.py runserver

# 3. En OTRA terminal - Frontend
cd frontend
npm run dev

# 4. Navegador
# - F12 → Application → Clear storage
# - O ejecutar: localStorage.clear()
# - Recargar: F5
# - Ir a: http://localhost:3000/register
# - Registrar nuevo usuario Owner
```

---

**¿Funciona ahora?** Prueba hacer login y navegar a Empresas. Si ves la página de empresas (aunque esté vacía), ¡significa que la autenticación funciona! 🎉
