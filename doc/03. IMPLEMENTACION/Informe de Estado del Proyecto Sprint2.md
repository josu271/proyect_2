# INFORME DE ESTADO DEL PROYECTO (SPRINT 2)

**Nombre del Proyecto: Sistema de Generación de Horarios Académicos**

**Gerente del Proyecto:** Sulla Corbetta Jose Luis

**Fecha: 03/05/2026 y 10/05/2026**

**Período del Informe: 28/04/2026 – 10/05/2026**

---

## Estado del:

### Alcance

Se completaron **4 de 4** requisitos planificados (100%), correspondientes a las historias de usuario del Sprint 2:

| Clave | Historia de Usuario | Story Points | Asignado | Estado |
|-------|---------------------|:------------:|----------|--------|
| SGDHA-12 | Autenticación de usuarios (JWT) | 5 | Vilcahuaman | ✅ Finalizada |
| SGDHA-10 | Visualizar horarios semanales | 3 | Sulla | ✅ Finalizada |
| SGDHA-6  | Validar límite de créditos (máx. 6) | 3 | Reyes | ✅ Finalizada |
| SGDHA-5  | Validar prerrequisitos académicos | 5 | Rafael | ✅ Finalizada |

**Total Story Points planificados:** 16  
**Total Story Points completados:** 16 (100%)

---

### Cronograma

**¿Estamos a tiempo?**

El equipo logró completar el 100% del trabajo planificado para el Sprint 2, sin embargo se detectó una concentración de avance hacia el final del sprint (días 9-10 del período), lo que refleja una tendencia similar a la del Sprint 1. Las tareas de autenticación JWT (SGDHA-12) tomaron más tiempo del estimado debido a la curva de aprendizaje en la configuración de tokens y middleware de seguridad.

**Métricas del Burndown Chart:**

- Total estimado inicial: **16 story points**
- Trabajo completado al final: **16 story points**
- Velocidad del equipo (Sprint 2): **16 SP / 2 semanas = 8 SP/semana**

El Burndown Chart del Sprint 2 muestra que, aunque se completó el 100% del trabajo, hubo una carga mayor de trabajo en los últimos 3 días del sprint. Se estableció un recordatorio al equipo para distribuir mejor la carga en el Sprint 3.

---

### Costos

El proyecto se mantiene dentro del presupuesto planificado. No se registraron sobrecostos.

| Historia de Usuario | Fecha de Entrega | Costo Estimado | Razón |
|---------------------|:----------------:|:--------------:|-------|
| SGDHA-12 – Autenticación usuarios (JWT) | 27/04/2026 | $75 | 5h × $15/h |
| SGDHA-10 – Visualizar horarios | 04/05/2026 | $45 | 3h × $15/h |
| SGDHA-6 – Validar créditos | 03/05/2026 | $45 | 3h × $15/h |
| SGDHA-5 – Validar prerrequisitos | 03/05/2026 | $75 | 5h × $15/h |
| **Subtotal Sprint 2** | | **$240** | |

---

### Calidad

**Actividades de calidad realizadas:**

- Revisión de criterios de aceptación para cada historia de usuario antes del cierre
- Pruebas manuales de autenticación con credenciales válidas e inválidas (SGDHA-12)
- Validación de límite de créditos con casos límite: 6, 7 y 0 créditos (SGDHA-6)
- Revisión de prerrequisitos con escenarios de cumplimiento e incumplimiento (SGDHA-5)
- Pruebas de visualización de horario semanal en distintos roles (SGDHA-10)

**Defectos encontrados:** 3  
- Defecto en validación JWT: token no expiraba correctamente → Corregido  
- Defecto visual: horario no mostraba aulas en la vista docente → Corregido  
- Defecto en validación de créditos: permitía exactamente 7 créditos → Corregido  

**Defectos corregidos:** 3 (100% resueltos)

---

### Riesgos

| Riesgo | Responsable | Mitigación |
|--------|-------------|-----------|
| Complejidad en implementación JWT con múltiples roles | Vilcahuaman | Se realizó spike técnico de 2h. Se usó librería `python-jose` para simplificar la implementación |
| Lógica de validación de créditos con prerrequisitos anidados | Rafael / Reyes | Se definió el orden de validación: primero prerrequisitos, luego créditos |
| Concentración del trabajo en los últimos días del sprint | Equipo | Se programó revisión de avance a mitad de sprint para el Sprint 3 |

---

### Próximos Avances (Sprint 3 – 11/05/2026 al 07/06/2026)

- **Implementar el motor CSP (backtracking + forward checking) para generación de horarios**  
  *(Responsable: Sulla – Fecha estimada: 31/05/2026)*
- **Desarrollar control de acceso por roles (admin, coordinador, docente, estudiante)**  
  *(Responsable: Reyes – Fecha estimada: 07/06/2026)*
- **Implementar evaluación de calidad del horario generado (métricas de optimización)**  
  *(Responsable: Vilcahuaman – Fecha estimada: 07/06/2026)*
- Ejecutar pruebas de integración entre módulo de autenticación y módulo de horarios
- Actualizar la documentación técnica con los endpoints REST nuevos

---

### Notas

- La historia SGDHA-12 (Autenticación) fue más compleja de lo estimado por la integración de JWT con FastAPI y la gestión de 4 roles distintos. Se resolvió con un spike técnico previo al desarrollo.
- La visualización de horarios (SGDHA-10) requirió coordinación directa entre Sulla (backend) y Reyes (frontend) para alinear el contrato de la API.
- El equipo mantuvo un ritmo de Daily Scrum 3 veces por semana durante este sprint.
- No hay impedimentos bloqueantes al cierre del sprint.
- **Velocidad acumulada:** Sprint 1: 17 SP | Sprint 2: 16 SP → Promedio: 16.5 SP/sprint
