# Revisión del Sprint 04

**Proyecto:** Generación Óptima de Horarios Académicos para Currículos Flexibles (SGDHA)
**Sprint:** 4 (08/06/2026 – 06/07/2026)

---

## Historias de Usuario completadas en este Sprint

- **SGDHA-11** – Optimizar carga de horarios (lazy loading + caché)
- **SGDHA-14** – Exportar horario a PDF
- **SGDHA-16** – Dashboard de Green Software (consumo de CO₂)
- **SGDHA-15** – Pruebas unitarias (cobertura ≥70%) — en curso al cierre del sprint, finalizada en la fase de cierre del proyecto

**Resultado:** 3 de 4 historias completadas dentro del sprint (75%); la historia restante se completó como parte de las actividades de cierre del proyecto, alcanzando el 100% del backlog.

---

## Demostración del trabajo completado

- Carga optimizada de horarios: 3.2s → 0.8s mediante lazy loading y caché (-75%, superando el objetivo de ≤1.5s).
- Exportación de horarios a PDF, incluyendo aulas y docentes asignados.
- Dashboard de Green Software con métricas en tiempo real del consumo de CO₂ del sistema.
- Avance de pruebas unitarias (Cypress + pytest), cobertura 52% al cierre del sprint.

---

## Pendientes (cierre del proyecto)

- Completar cobertura de pruebas unitarias (SGDHA-15).
- Elaborar Project Closeout y Lecciones Aprendidas.
- Actualizar revisión y retrospectiva de todos los sprints.
- Cerrar el 100% del backlog en Jira y entregar el PMV v1.0.0.

---

## Notas adicionales

Aplicar lazy loading y caché en el frontend permitió superar ampliamente el objetivo de rendimiento de carga de horarios. Sin embargo, dejar las pruebas unitarias para el último sprint fue un error de planificación: la cobertura quedó en 52% (objetivo ≥70%) y la historia debió cerrarse en la fase de cierre del proyecto en lugar de dentro del Sprint 4.

El módulo de Green Software, que mide el consumo de CO₂ del propio sistema, permitió agregar un diferencial valioso para la sustentación final del proyecto.

Se detectaron y corrigieron 3 defectos durante el sprint (100% resueltos):
- La exportación a PDF no mostraba el nombre del aula en la vista del docente.
- La caché del frontend no se invalidaba al actualizar un horario.
- El dashboard de Green Software mostraba valores negativos antes de la primera carga de datos.
