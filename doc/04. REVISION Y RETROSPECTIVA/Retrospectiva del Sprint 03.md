# Retrospectiva del Sprint 03

**Proyecto:** Generación Óptima de Horarios Académicos para Currículos Flexibles (SGDHA)
**Sprint:** 3 (06/05/2026 – 07/06/2026)

---

## ¿Qué aprendimos?

**Técnica:** el motor CSP requirió 3 iteraciones de refinamiento antes de cumplir el objetivo de ≤50s; activar primero un fallback simple (backtracking puro) permitió avanzar sin bloquear el sprint.

**Metodología:** la revisión de avance a mitad de sprint permitió detectar a tiempo el retraso en la historia más compleja y reasignar esfuerzo.

**Herramientas:** indexar las tablas de restricciones en PostgreSQL redujo significativamente el tiempo de generación de horarios.

---

## ¿Qué estamos haciendo bien?

- Se completaron 3 de 3 historias de usuario (100%), incluyendo la de mayor complejidad del proyecto (motor CSP, 8 SP).
- El motor CSP alcanzó un tiempo de generación de 32s en promedio, muy por debajo del umbral de 50s.
- Buena coordinación entre el motor CSP (backend) y el evaluador de calidad para validar horarios óptimos.
- Corrección oportuna de los 4 defectos detectados (100% resueltos).

---

## ¿Qué podemos hacer mejor?

### Personas
- Apoyar a quien lleva la historia más compleja del sprint.
- Documentar decisiones de diseño del motor CSP para el equipo.

### Relaciones
- Validar con usuarios los criterios de calidad antes de programar.
- Coordinar temprano los límites de permisos entre roles.

### Procesos
- Mantener la revisión a mitad de sprint en historias complejas.
- Definir un plan de fallback desde el inicio en historias técnicamente riesgosas.
- Probar control de acceso con todos los roles desde el primer commit.

### Herramientas
- Usar el Burndown Chart para anticipar riesgo en historias grandes.
- Documentar en Jira las iteraciones del motor CSP y sus resultados.

---

## Acciones a realizar

1. Mantener la revisión de avance a mitad de sprint para historias complejas.
2. Definir un plan de fallback desde el inicio en historias técnicamente riesgosas.
3. Probar control de acceso con todos los roles desde el primer commit.
4. Usar el Burndown Chart para anticipar riesgo en historias de alto esfuerzo.
5. Documentar en Jira las iteraciones del motor CSP y sus resultados.
