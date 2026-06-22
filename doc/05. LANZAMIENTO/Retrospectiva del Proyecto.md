# Retrospectiva del Proyecto

**Proyecto:** Generación Óptima de Horarios Académicos (SGDHA)
**Fecha:** 06/07/2026

---

## ¿Qué estamos haciendo bien?

- Se completó el 100% del backlog planificado (16 historias de usuario, 6 Epics) al cierre del proyecto.
- El motor CSP generó horarios válidos en 32s promedio, muy por debajo del umbral de 50s.
- Optimización de frontend: reducción del 75% en el tiempo de carga de horarios (3.2s → 0.8s).
- Corrección del 100% de los 12 defectos detectados a lo largo de los 4 sprints.

---

## ¿Qué podemos hacer mejor?

### Personas
- Distribuir mejor la carga: 3 de 4 sprints concentraron trabajo al final.
- Evitar que una sola persona concentre tareas técnicas críticas.

### Relaciones
- Coordinar con QA desde el inicio, no solo en el último sprint.
- Anticipar con usuarios los casos límite antes de programar.

### Procesos
- Definir criterios de aceptación detallados desde el inicio.
- Distribuir las pruebas unitarias en todos los sprints, no al final.
- Actualizar la documentación de revisión y retrospectiva en cada sprint.

### Herramientas
- Usar el Burndown Chart de forma proactiva desde el inicio.
- Integrar Cypress y pytest desde el inicio, con metas por sprint.

---

## Lecciones aprendidas

1. Definir criterios de aceptación detallados desde el primer sprint, no sobre la marcha.
2. Planificar y distribuir las pruebas unitarias en todos los sprints, nunca al final.
3. Anticipar los riesgos técnicos de alta complejidad con spikes antes de comprometer fechas.
4. Mantener actualizada la documentación de cada sprint al cierre, no acumularla para el final.
5. Distribuir el trabajo de forma uniforme durante todo el sprint, evitando la concentración hacia el final.

---

## Conclusión

El equipo del proyecto SGDHA cerró las 4 iteraciones planificadas cumpliendo el 100% del backlog y los criterios de éxito definidos en el Project Charter, con un producto técnicamente viable (motor CSP por debajo del umbral de tiempo, frontend optimizado, cobertura de pruebas alcanzada en cierre). La lección transversal de todo el proyecto es la importancia de la planificación temprana de actividades de soporte (pruebas, documentación) en lugar de postergarlas, y de mantener una distribución de carga uniforme dentro de cada sprint.
