# Revisión del Sprint 02

**Proyecto:** Generación Óptima de Horarios Académicos para Currículos Flexibles (SGDHA)
**Sprint:** 2 (13/04/2026 – 05/05/2026)

---

## Historias de Usuario completadas en este Sprint

- **SGDHA-12** – Autenticación de usuarios (JWT)
- **SGDHA-10** – Visualizar horarios semanales
- **SGDHA-6** – Validar límite de créditos (máx. 6)
- **SGDHA-5** – Validar prerrequisitos académicos

**Resultado:** 4 de 4 historias completadas (100% del Sprint 2).

---

## Demostración del trabajo completado

- Login con autenticación JWT para los 4 roles (admin, coordinador, docente, estudiante).
- Vista semanal de horarios por rol.
- Validación de límite de créditos (máximo 6) con casos límite probados (0, 6 y 7 créditos).
- Validación de prerrequisitos académicos.

---

## Pendientes (hacia el Sprint 3)

- Implementación del motor CSP (backtracking + forward checking).
- Control de acceso por roles (4 roles).
- Evaluación de calidad del horario generado.
- Pruebas de integración entre autenticación y horarios.

---

## Notas adicionales

Durante el Sprint 2, la integración de JWT con 4 roles distintos tomó más tiempo del estimado inicialmente. Se resolvió mediante un spike técnico de 2 horas y la adopción de la librería `python-jose`, lo que evitó retrasos mayores en el cronograma del sprint.

Se detectaron y corrigieron 3 defectos durante el sprint (100% resueltos):
- Token JWT no expiraba correctamente.
- El horario no mostraba aulas en la vista del docente.
- La validación de créditos permitía hasta 7 créditos en lugar de 6.
