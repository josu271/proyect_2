---
---

# INFORME DE ESTADO DEL PROYECTO (SPRINT 4)

**Nombre del Proyecto: Sistema de Generación de Horarios Académicos**

**Gerente del Proyecto:** Sulla Corbetta Jose Luis

**Fecha: 15/06/2026 y 19/06/2026**

**Período del Informe: 08/06/2026 – 19/06/2026**

---

## Estado del:

### Alcance

Se completaron **3 de 4** historias de usuario planificadas (75%). La historia de pruebas unitarias (SGDHA-14) quedó **En Curso** al cierre del sprint, con avance parcial del 60% estimado. El resto del alcance fue entregado satisfactoriamente.

| Clave | Historia de Usuario | Story Points | Asignado | Estado |
|-------|---------------------|:------------:|----------|--------|
| SGDHA-15 | Optimizar carga de horarios (lazy loading + caché) | 5 | Vilcahuaman | ✅ Finalizada |
| SGDHA-11 | Exportar horarios a PDF | 3 | Reyes | ✅ Finalizada |
| SGDHA-16 | Green Software (métricas de consumo CO₂) | 3 | Rafael | ✅ Finalizada |
| SGDHA-14 | Ejecutar pruebas unitarias (Cypress + pytest, cobertura ≥ 70%) | 5 | Sulla | 🔄 En Curso |

**Total Story Points planificados:** 16  
**Total Story Points completados:** 11 (68.75%)  
**Story Points en curso al cierre:** 5 (SGDHA-14)

---

### Cronograma

**¿Estamos a tiempo?**

El Sprint 4 presentó el mayor desafío en términos de cronograma. De las 4 historias planificadas, 3 fueron completadas dentro del período establecido (08/06 – 19/06/2026), pero la historia de mayor esfuerzo técnico (SGDHA-14 – Pruebas unitarias) no alcanzó a cerrarse en el sprint. Esto se debió principalmente a la complejidad de alcanzar una cobertura de pruebas ≥ 70% sobre todos los módulos del sistema (CRUD, CSP, autenticación, roles y exportación).

**Métricas del Burndown Chart:**

- Total estimado inicial: **16 story points**
- Trabajo completado al cierre del sprint: **11 story points**
- Story points restantes: **5 SP (SGDHA-14 – continúa en backlog)**
- Velocidad del equipo (Sprint 4): **11 SP completados / 2 semanas**

El Burndown Chart refleja un avance constante durante las dos primeras semanas del sprint para las tres historias completadas, pero la curva de SGDHA-14 no descendió lo suficiente para cerrar dentro del período. Las pruebas unitarias de los módulos de autenticación y el motor CSP resultaron significativamente más complejas de lo estimado, lo que generó el retraso.

> **Nota:** La historia SGDHA-14 es trasladada al backlog de cierre del proyecto y se completará como parte de las actividades de entrega final.

---

### Costos

El proyecto cierra dentro del rango presupuestado. Los 5 SP no completados de SGDHA-14 se contabilizan como trabajo pendiente, no como sobrecosto, ya que el esfuerzo parcial fue absorbido en el sprint.

| Historia de Usuario | Fecha de Entrega | Costo Estimado | Razón |
|---------------------|:----------------:|:--------------:|-------|
| SGDHA-15 – Optimizar carga de horarios | 14/06/2026 | $75 | 5h × $15/h |
| SGDHA-11 – Exportar horarios a PDF | 13/06/2026 | $45 | 3h × $15/h |
| SGDHA-16 – Green Software | 15/06/2026 | $45 | 3h × $15/h |
| SGDHA-14 – Pruebas unitarias (parcial) | En curso | $45 | ~3h invertidas de 5h estimadas |
| **Subtotal Sprint 4** | | **$210** | |

**Resumen de costos acumulados del proyecto:**

| Sprint | Story Points | Costo |
|--------|:------------:|------:|
| Sprint 1 – CRUD y Restricciones | 17 SP | $450 |
| Sprint 2 – Autenticación y Validaciones | 16 SP | $240 |
| Sprint 3 – Motor CSP y Roles | 18 SP | $270 |
| Sprint 4 – Optimización, Exportación y Pruebas | 11 SP completados | $210 |
| **TOTAL ACUMULADO** | **62 SP** | **$1,170** |

---

### Calidad

**Actividades de calidad realizadas:**

- Pruebas de rendimiento de carga: el tiempo de visualización del horario bajó de 3.2s a 0.8s con lazy loading y caché (SGDHA-15)
- Pruebas de exportación PDF en distintos navegadores y sistemas operativos (Chrome, Firefox, Edge / Windows, Linux) — SGDHA-11
- Validación de las métricas de consumo energético del dashboard Green Software con datos del escenario de prueba estándar — SGDHA-16
- Avance parcial en pruebas unitarias: cobertura alcanzada al cierre del sprint ≈ **52%** (objetivo: 70%) — SGDHA-14

**Defectos encontrados:** 3
- Exportación PDF no incluía el nombre del aula en el horario del docente → Corregido
- El caché del frontend no se invalidaba al actualizar el horario desde el admin → Corregido
- El dashboard de Green Software mostraba valores negativos en escenarios sin carga → Corregido

**Defectos corregidos:** 3 (100% resueltos en las historias finalizadas)

---

### Riesgos

| Riesgo | Responsable | Estado | Mitigación Aplicada |
|--------|-------------|:------:|---------------------|
| Cobertura de pruebas insuficiente (<70%) al cierre del proyecto (R11) | Sulla / Rafael | 🔴 Activo | SGDHA-14 trasladada al backlog de cierre. Se priorizará completar las pruebas de los módulos de autenticación y CSP, que son los más críticos |
| Concentración del trabajo en últimos días del sprint (R16) | Equipo | 🟡 Parcial | Se detectó carga excesiva sobre Sulla en los últimos 3 días por la convergencia de pruebas unitarias y documentación de cierre. Para la fase de cierre se distribuirá la carga entre todo el equipo |
| Complejidad de pruebas sobre el motor CSP (nuevo) | Sulla | 🔴 Activo | El módulo de generación de horarios requiere fixtures complejos para pytest. Se definirá una estrategia de mocks para los fixtures del CSP |

---

### Próximos Avances (Cierre del Proyecto – a partir de 19/06/2026)

- **Completar SGDHA-14:** Alcanzar cobertura de pruebas ≥ 70% (módulos pendientes: autenticación, motor CSP)  
  *(Responsable: Sulla – Prioridad: Alta)*
- Generar tag `v1.0.0` en el repositorio GitHub y preparar Release Notes
- Desplegar versión final en plataforma de producción (Render/Railway + Vercel)
- Completar documentación de cierre del proyecto (Lessons Learned, Project Closeout)
- Preparar video demostrativo del sistema (≤ 5 minutos)
- Entregar informe técnico final con resultados de las pruebas de rendimiento del algoritmo CSP

---

### Notas

- La optimización de carga (SGDHA-15) logró reducir el tiempo de respuesta del horario en un **75%** (de 3.2s a 0.8s), superando el objetivo de ≤ 1.5s establecido en los criterios de aceptación.
- La funcionalidad de exportación a PDF (SGDHA-11) permite generar horarios personalizados por estudiante, docente o aula en formato descargable, añadiendo valor directo al usuario final.
- El módulo Green Software (SGDHA-16) implementa métricas de consumo energético estimado del servidor durante la generación de horarios, alineándose con los principios de sostenibilidad del software.
- **Velocidad final por sprint:** Sprint 1: 17 SP | Sprint 2: 16 SP | Sprint 3: 18 SP | Sprint 4: 11 SP (completados)
- **Velocidad promedio del proyecto:** ~15.5 SP/sprint (sobre historias finalizadas)
- **Total story points entregados:** 62 de 67 planificados → **92.5% de cumplimiento del backlog**
