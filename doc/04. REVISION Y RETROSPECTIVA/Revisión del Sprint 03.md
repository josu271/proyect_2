# Revisión del Sprint 03

**Proyecto:** Generación Óptima de Horarios Académicos para Currículos Flexibles (SGDHA)
**Sprint:** 3 (06/05/2026 – 07/06/2026)

---

## Historias de Usuario completadas en este Sprint

- **SGDHA-8** – Generar horarios (motor CSP: backtracking + forward checking)
- **SGDHA-9** – Evaluar calidad del horario generado
- **SGDHA-13** – Controlar acceso por roles (admin, coordinador, docente, estudiante)

**Resultado:** 3 de 3 historias completadas (100% del Sprint 3), incluyendo la historia de mayor complejidad del proyecto (motor CSP, 8 Story Points).

---

## Demostración del trabajo completado

- Generación automática de horarios mediante motor CSP (32s promedio para un escenario de 200 estudiantes, 10 cursos y 10 docentes).
- Evaluador de calidad del horario (detección de huecos y balance de carga).
- Control de acceso por roles: admin, coordinador, docente y estudiante.
- Integración motor CSP → API REST → Frontend (visualización del horario generado).

---

## Pendientes (hacia el Sprint 4)

- Optimizar la carga de horarios en el frontend (lazy loading + caché).
- Exportar horarios a PDF.
- Pruebas unitarias con cobertura ≥ 70% (Cypress + pytest).
- Dashboard de Green Software (métricas de consumo de CO₂).

---

## Notas adicionales

El motor CSP requirió 3 iteraciones de refinamiento antes de cumplir el objetivo de tiempo de generación (≤50s). Activar primero un fallback simple (backtracking puro) permitió avanzar sin bloquear el sprint mientras se optimizaba el algoritmo. Indexar las tablas de restricciones en PostgreSQL redujo significativamente el tiempo de generación de horarios.

Se detectaron y corrigieron 4 defectos durante el sprint (100% resueltos):
- Solapamiento de docentes en casos extremos del CSP.
- El evaluador de calidad no penalizaba correctamente huecos mayores a 2 horas.
- El rol coordinador podía acceder a endpoints reservados para administrador.
- La vista de horario no se actualizaba en tiempo real tras cambios.
