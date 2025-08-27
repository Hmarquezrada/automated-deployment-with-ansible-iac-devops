# Configuración de Autenticación Local

Este proyecto ha sido configurado para usar autenticación local en lugar de una base de datos externa.

## Credenciales de Acceso

Para acceder al sistema, usa las siguientes credenciales:

- **Email:** `admin@admin.com`
- **Contraseña:** `admin`

## Características de la Autenticación Local

### ✅ Ventajas
- No requiere conexión a base de datos externa
- Funciona completamente offline
- Sesiones persistentes usando localStorage
- Ideal para pruebas y desarrollo

### ⚠️ Limitaciones
- Solo un usuario predefinido
- Credenciales hardcodeadas (no seguras para producción)
- No hay registro de usuarios
- No hay recuperación de contraseñas

## Estructura de Archivos

- `lib/localAuth.ts` - Lógica de autenticación local
- `components/AuthProvider.tsx` - Proveedor de contexto de autenticación
- `hooks/useAuth.ts` - Hook para manejar autenticación
- `components/AuthGuard.tsx` - Protección de rutas

## Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Sistema verifica contra credenciales hardcodeadas
3. Si son válidas, se crea una sesión local
4. Sesión se guarda en localStorage
5. Usuario es redirigido a `/panel`
6. AuthGuard protege las rutas privadas

## Persistencia de Sesión

- Las sesiones duran 24 horas
- Se mantienen entre recargas de página
- Se limpian automáticamente al expirar
- Se pueden cerrar manualmente con "Cerrar Sesión"

## Uso en Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Acceder a http://localhost:3000
# Usar credenciales: admin@admin.com / admin
```

## Notas de Seguridad

⚠️ **IMPORTANTE:** Esta configuración es solo para pruebas y desarrollo. No usar en producción ya que:

- Las credenciales están hardcodeadas en el código
- No hay encriptación de contraseñas
- No hay validación de sesiones del lado del servidor
- No hay protección contra ataques de fuerza bruta

Para producción, se recomienda implementar:
- Autenticación JWT con servidor
- Base de datos segura
- Encriptación de contraseñas
- Rate limiting
- Validación de sesiones
