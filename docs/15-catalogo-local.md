# Catálogo local conectado

## Alcance implementado

Las aplicaciones `customer` (puerto 3000) y `restaurant` (puerto 3001) comparten un catálogo persistente mediante NestJS (puerto 4000), PostgreSQL y Drizzle. Cada cuenta con rol `RESTAURANT` tiene un solo establecimiento asignado. Las cuentas iniciales son de prueba; las marcas no participan en Coconea.

Se pueden crear productos y editar nombre, descripción, precio, categoría, imagen, disponibilidad, ingredientes y declaraciones de alérgenos. También se puede editar el nombre, descripción e imagen del restaurante. No se implementan cargas de archivos: las imágenes usan rutas locales `/images/` o URLs HTTPS.

El consumidor consulta los datos al entrar, al recuperar el foco y cada cinco segundos mientras la pestaña está visible. No depende de `localStorage`, de cookies entre puertos ni de que ambas vistas estén abiertas en el mismo navegador. Requiere acceso a la misma API. No se sustituyen datos por una simulación cuando falla la API.

**Alcance y límites:** el registro, acceso y cierre de sesión del consumidor y el acceso del restaurante usan Better Auth con PostgreSQL. Programaciones, propuestas, pagos, pedidos y preferencias alimenticias siguen siendo prototipos. El registro local solicita únicamente nombre, correo y contraseña. El modo local no presenta una confirmación simulada como pedido real.

## Inicio reproducible

Requisitos: Node.js 24 LTS, pnpm según `packageManager` y Docker Desktop iniciado.

Desde la raíz, ejecutar:

```bash
pnpm install --frozen-lockfile
pnpm setup:local
pnpm dev
```

El preparador copia los ejemplos únicamente si falta el archivo, sustituye el secreto de ejemplo por uno aleatorio, espera a PostgreSQL y ejecuta migraciones y semilla. No imprime contraseñas. `node scripts/setup-local.mjs --env-only` prepara solo los archivos; `pnpm setup:local --skip-docker` usa una instancia PostgreSQL que ya esté disponible en `DATABASE_URL`.

Las migraciones son versionadas y aditivas. La semilla conserva cuentas y productos existentes; no sobrescribe las ediciones. Para cambios de esquema, generar y revisar una migración con `pnpm --filter @coconea/api db:generate` antes de aplicarla.

## Cuentas de prueba

La semilla crea `mcdonalds@coconea.local`, `subway@coconea.local`, `kfc@coconea.local`, `dominos@coconea.local` y `greengrass@coconea.local` con contraseñas aleatorias individuales.

Las contraseñas nuevas se guardan únicamente en `tmp/restaurant-accounts.json`, excluido de Git. No se imprimen en los logs. El archivo permite entrar en `http://localhost:3001`. Si se ejecuta otra vez la semilla, las contraseñas existentes se conservan. No hay registro público de restaurantes. Los consumidores crean su cuenta en http://localhost:3000/register; el servidor asigna exclusivamente el rol USER, sin aceptar el rol enviado por el navegador. Las cuentas de muestra de la demo no son cuentas de la base local. Las cookies de localhost se comparten entre puertos; para usar a la vez dos identidades, abrir perfiles de navegador separados.

Better Auth guarda hashes de contraseña y sesiones en PostgreSQL. La cookie de sesión es HttpOnly; en producción se exige cookie segura y TLS. El control de frecuencia de acceso usa memoria del único proceso de API y se reinicia con él; no sustituye límites de un despliegue público.

## Autorización y consistencia

- El servidor obtiene el restaurante desde la sesión, nunca desde un `restaurant_id` enviado por el cliente.
- Una cuenta `USER`, una cuenta deshabilitada y una solicitud sin sesión no pueden administrar el catálogo.
- Las mutaciones requieren un `Origin` permitido. CORS acepta únicamente los orígenes configurados de consumidor y restaurante.
- Se rechazan campos inesperados y URLs de imágenes con protocolos inseguros.
- Los precios viajan como cadenas decimales y se almacenan en `numeric(10,2)` con restricción positiva.
- Cada actualización exige `version`. Una versión desactualizada devuelve HTTP 409, evitando sobrescribir cambios concurrentes.
- La edición y su evento de auditoría se guardan en una misma transacción.
- Una declaración incompleta o vacía no afirma que el alimento esté libre de alérgenos. Los valores nutricionales desconocidos se mantienen desconocidos.

## Demo estática

`NEXT_PUBLIC_APP_MODE=demo` conserva el catálogo ficticio compartido y el panel de muestra, sin llamar a la API ni usar sesiones reales. `NEXT_PUBLIC_APP_MODE=local` habilita la integración descrita. La demo estática no sincroniza ediciones entre aplicaciones.

Los archivos de compilación de desarrollo usan `.next-dev` y los de producción `.next`, para que una compilación no sobrescriba al servidor de desarrollo.

La API usa `tsconfig.dev.json` y `.dev-dist` al ejecutar `pnpm dev`; `pnpm build` conserva `dist`. Así la compilación de producción tampoco interrumpe la API en desarrollo.

Si el puerto 3000 está ocupado por otro proyecto, configurar `PORT=3005` en `apps/customer/.env.local`, `CUSTOMER_WEB_URL=http://localhost:3005` en `.env` y `NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3005` en los archivos de entorno de las dos webs, y reiniciar los procesos. `pnpm --filter @coconea/customer dev` toma ese puerto del archivo local. La configuración habitual del consumidor es el puerto 3000; el panel permanece en 3001 y la API en 4000.

## Verificación

- `pnpm --filter @coconea/api test`: crea una base temporal con nombre aleatorio y la elimina al terminar, sin modificar el catálogo local. Comprueba sesiones, roles, IDOR, origen, validación, auditoría, concurrencia, disponibilidad y persistencia tras reiniciar la API.
- `pnpm --filter @coconea/api build`.
- `pnpm --filter @coconea/customer build` y `pnpm --filter @coconea/restaurant build`.
- Prueba manual: entrar a un restaurante, editar un producto, guardar y comprobar el cambio en `http://localhost:3000` tras unos segundos o al volver a la pestaña.

Los scripts de lint del repositorio todavía son marcadores de posición; no equivalen a una validación de ESLint. Las comprobaciones de tipos, compilación y pruebas de integración son ejecutables.

## Integración con el trabajo remoto

Se conserva el historial de ambas ramas y se adapta la bienvenida del consumidor. La implementación SQLite/TypeORM y sus endpoints sin autorización se sustituyen por el catálogo PostgreSQL/Drizzle y las sesiones Better Auth; no se importa la base SQLite. Las cuatro webs usan la tipografía local Plus Jakarta Sans incluida con su licencia OFL para compilar sin descargar fuentes.

Si Docker Desktop falla antes de iniciar el motor, no ejecutar un restablecimiento de fábrica para preparar Coconea. La aplicación requiere que Docker esté operativo; el preparador no borra volúmenes ni repara la instalación de Docker.
