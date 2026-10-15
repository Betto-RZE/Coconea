# Guía de Contribución a Coconea (Diet Delivery)

¡Gracias por tu interés en contribuir a Coconea! Este documento detalla las normas y directrices para colaborar en este proyecto.

---

## 1. Convenciones de Git y Ramas

- **Rama principal**: `main` (código listo para producción).
- **Ramas de desarrollo**:
  - `feat/<nombre-de-funcionalidad>`: Nuevas características.
  - `fix/<nombre-del-bug>`: Correcciones de errores.
  - `docs/<tema>`: Modificaciones o adiciones en documentación.
  - `refactor/<alcance>`: Refactorizaciones sin alterar comportamiento externo.
  - `chore/<tarea>`: Mantenimiento, dependencias, tooling.

---

## 2. Convención de Commits (Conventional Commits)

Los mensajes de commit deben seguir el estándar [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

```text
<tipo>(<alcance>): <descripción corta en presente o imperativo>

[cuerpo opcional detallado]

[pie opcional con referencias a tickets/issues]
```

Ejemplos:
- `feat(customer): add diet preference selection filter`
- `fix(api): correct order status transition validation`
- `docs(architecture): update system diagram in 10-arquitectura.md`

---

## 3. Flujo de Trabajo (Pull Requests)

1. Haz un fork o crea una rama a partir de `main`.
2. Asegúrate de que las pruebas y linters pasen localmente.
3. Envía un Pull Request describiendo claramente los cambios introducidos.
4. Vincula el PR al Issue correspondiente.
5. Requiere aprobación antes del merge.
