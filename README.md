# Coconea

> **«Coconea — Planifica tu alimentación, confirma y recibe.»**

**Coconea** es una plataforma web responsiva de pedidos de alimentos, diseñada como proyecto de portafolio profesional. Su característica distintiva es permitir programaciones recurrentes de comida, tanto de selección fija (`FIXED`) como de recomendaciones basadas en preferencias y restricciones alimenticias (`RECOMMENDATION`).

- **Presupuesto objetivo:** $0 MXN.
- **Arquitectura:** Monorepo con backend monolítico modular.
- **Persistencia:** PostgreSQL como fuente de verdad única.

---

## 📁 Estructura del Monorepo

```text
coconea/
├── apps/
│   ├── customer/                 # Web del consumidor (Next.js + React)
│   ├── restaurant/               # Panel web del restaurante (Next.js + React)
│   ├── delivery/                 # Web del repartidor (Next.js + React)
│   ├── admin/                    # Panel web administrativo (Next.js + React)
│   └── api/                      # Backend y API central (NestJS /v1)
│
├── packages/
│   ├── shared/                   # Utilidades comunes independientes del entorno
│   ├── types/                    # Tipos y contratos compartidos
│   ├── validation/               # Esquemas de validación compartidos (Zod)
│   └── config/                   # Configuraciones compartidas (TypeScript, linting)
│
├── docs/                         # Documentación funcional, técnica y de seguridad
│   ├── 01-descripcion-general.md
│   ├── 02-objetivos-y-alcance.md
│   ├── 03-actores-y-roles.md
│   ├── 04-requerimientos-funcionales.md
│   ├── 05-requerimientos-no-funcionales.md
│   ├── 06-casos-de-uso.md
│   ├── 07-flujos-de-usuario.md
│   ├── 08-reglas-de-negocio.md
│   ├── 09-modelo-de-datos.md
│   ├── 10-arquitectura.md
│   ├── 11-api.md
│   ├── 12-seguridad.md
│   └── 13-stack-tecnologico.md
│
├── infrastructure/               # Docker Compose para PostgreSQL local
├── scripts/                      # Automatizaciones y utilidades
├── .github/                      # CI con GitHub Actions y plantillas
├── package.json                  # Monorepo root package.json
├── pnpm-workspace.yaml           # Configuración de workspaces de pnpm
├── turbo.json                    # Pipeline de Turborepo
├── tsconfig.base.json            # Configuración base estricta de TypeScript
├── .env.example                  # Plantilla de variables de entorno locales
├── .gitignore
├── .editorconfig
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

---

## 🛠️ Stack Tecnológico Aprobado

- **Lenguaje:** TypeScript (strict mode en todo el monorepo).
- **Gestión de paquetes y monorepo:** pnpm Workspaces y Turborepo.
- **Frontend (4 aplicaciones):** Next.js + React, Tailwind CSS y shadcn/ui.
- **Formularios y validación:** React Hook Form y Zod.
- **Estado y datos del servidor:** TanStack Query y Zustand.
- **Backend:** NestJS, API REST JSON versionada bajo `/v1`.
- **Base de datos:** PostgreSQL (instancia local vía Docker Compose).
- **ORM y migraciones:** Drizzle ORM.
- **Autenticación:** Better Auth integrado con NestJS, PostgreSQL y Drizzle.
- **Autorización:** RBAC y verificación de propiedad de cada recurso.
- **Trabajos en segundo plano:** pg-boss con PostgreSQL.
- **Simulador de pagos:** `MockPaymentProvider` (sin cobros reales, $0 MXN).
- **Notificaciones MVP:** Centro interno persistente en base de datos.
- **Pruebas:** Vitest (unitarias), Supertest (API NestJS) y Playwright (E2E).

---

## 🎯 Reglas de Negocio Clave

1. **Programar no es comprar:** Una programación recurrente genera una ocurrencia y una propuesta; nunca crea por sí sola un pedido ni un cargo.
2. **Confirmación explícita:** Solo una confirmación autenticada y vigente del consumidor inicia la creación de un pedido. Sin confirmación, no hay compra ni cargo.
3. **Revalidación previa:** Antes de confirmar, se revalidan precios, disponibilidad, horarios y alérgenos.
4. **Idempotencia:** Solicitudes repetidas o reintentos no deben duplicar pedidos ni pagos.
5. **Restricciones alimenticias:** La falta de información de ingredientes o alérgenos no implica que un producto sea seguro.

---

## 💻 Modalidades de Ejecución

- **Sistema Completo Local:** Ejecuta las cuatro webs Next.js, API NestJS, PostgreSQL (Docker Compose), Drizzle ORM, Better Auth y pg-boss.
- **Demostración Pública:** Exportación estática compatible con Cloudflare Pages con datos ficticios y adaptadores de demo ($0 MXN).

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Prerrequisitos
- Node.js LTS (>= 20)
- pnpm (>= 9)
- Docker Desktop / Docker Compose

### Pasos
1. Clonar el repositorio y copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Iniciar la base de datos local:
   ```bash
   docker compose -f infrastructure/docker-compose.yml up -d
   ```
3. Instalar dependencias:
   ```bash
   pnpm install
   ```
4. Ejecutar entorno de desarrollo:
   ```bash
   pnpm dev
   ```

---

## 📚 Documentación

Consulta la documentación técnica completa en [`docs/`](docs/):
- [01. Descripción General](docs/01-descripcion-general.md)
- [02. Objetivos y Alcance](docs/02-objetivos-y-alcance.md)
- [03. Actores y Roles](docs/03-actores-y-roles.md)
- [04. Requerimientos Funcionales](docs/04-requerimientos-funcionales.md)
- [05. Requerimientos No Funcionales](docs/05-requerimientos-no-funcionales.md)
- [06. Casos de Uso](docs/06-casos-de-uso.md)
- [07. Flujos de Usuario](docs/07-flujos-de-usuario.md)
- [08. Reglas de Negocio](docs/08-reglas-de-negocio.md)
- [09. Modelo de Datos](docs/09-modelo-de-datos.md)
- [10. Arquitectura](docs/10-arquitectura.md)
- [11. API](docs/11-api.md)
- [12. Seguridad](docs/12-seguridad.md)
- [13. Stack Tecnológico](docs/13-stack-tecnologico.md)

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).