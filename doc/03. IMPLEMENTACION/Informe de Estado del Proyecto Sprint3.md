# INFORME DE ESTADO DEL PROYECTO (SPRINT 3)

**Nombre del Proyecto: Sistema de Generación de Horarios Académicos**

**Gerente del Proyecto:** Sulla Corbetta Jose Luis

**Fecha: 07/06/2026 y 10/06/2026**

**Período del Informe: 11/05/2026 – 07/06/2026**

---

## Estado del:

### Alcance

Se completaron **3 de 3** requisitos planificados (100%), correspondientes a las historias de usuario del Sprint 3. Este sprint incluyó la historia de mayor complejidad del proyecto: la implementación del motor de generación de horarios mediante algoritmo CSP.

| Clave | Historia de Usuario | Story Points | Asignado | Estado |
|-------|---------------------|:------------:|----------|--------|
| SGDHA-8  | Generar horarios (motor CSP backtracking + forward checking) | 8 | Sulla | ✅ Finalizada |
| SGDHA-9  | Evaluar calidad del horario generado | 5 | Vilcahuaman | ✅ Finalizada |
| SGDHA-13 | Controlar acceso por roles (admin, coordinador, docente, estudiante) | 5 | Reyes | ✅ Finalizada |

**Total Story Points planificados:** 18  
**Total Story Points completados:** 18 (100%)

---

### Cronograma

**¿Estamos a tiempo?**

El Sprint 3 fue el sprint más exigente del proyecto, con 18 story points planificados y una historia de alta complejidad técnica (SGDHA-8 con 8 SP). El equipo logró completar el 100% del alcance dentro del período establecido.

La implementación del motor CSP (SGDHA-8) requirió 3 iteraciones de refinamiento del algoritmo de backtracking antes de alcanzar los criterios de aceptación (generación de horario válido en ≤ 50 segundos para el escenario base de 200 estudiantes, 10 cursos y 10 docentes). El equipo gestionó este riesgo activando la solución fallback (backtracking puro sin forward checking) como base para luego añadir la optimización.

**Métricas del Burndown Chart:**

- Total estimado inicial: **18 story points**
- Trabajo completado al final: **18 story points**
- Velocidad del equipo (Sprint 3): **18 SP / 4 semanas = 4.5 SP/semana**

A diferencia de los sprints anteriores, el Burndown Chart del Sprint 3 muestra un avance más distribuido en el tiempo, lo que refleja la mejora en planificación y seguimiento semanal implementada como acción correctiva tras el Sprint 2.

---

### Costos

El proyecto se mantiene dentro del presupuesto planificado. La complejidad adicional del motor CSP no generó sobrecostos dado que fue absorbida por el equipo dentro de las horas estimadas.

| Historia de Usuario | Fecha de Entrega | Costo Estimado | Razón |
|---------------------|:----------------:|:--------------:|-------|
| SGDHA-8 – Generar horarios (motor CSP) | 07/06/2026 | $120 | 8h × $15/h |
| SGDHA-9 – Evaluar calidad del horario | 07/06/2026 | $75 | 5h × $15/h |
| SGDHA-13 – Controlar acceso por roles | 07/06/2026 | $75 | 5h × $15/h |
| **Subtotal Sprint 3** | | **$270** | |

**Costo acumulado del proyecto (Sprints 1-3):**

| Sprint | Costo |
|--------|------:|
| Sprint 1 | $450 |
| Sprint 2 | $240 |
| Sprint 3 | $270 |
| **Total acumulado** | **$960** |

---

### Calidad

**Actividades de calidad realizadas:**

- Pruebas del algoritmo CSP con 3 escenarios distintos de carga (50, 100 y 200 estudiantes)
- Validación de tiempo de respuesta del motor: promedio de **32 segundos** para el escenario base → dentro del umbral ≤ 50 segundos
- Pruebas de control de acceso: se verificaron los 4 roles (admin, coordinador, docente, estudiante) con rutas protegidas
- Verificación de que la evaluación de calidad detecta correctamente huecos en el horario y penaliza la distribución desbalanceada
- Pruebas de integración: motor CSP → API REST → Frontend (visualización del horario generado)

**Defectos encontrados:** 4  
- El algoritmo CSP generaba horarios con solapamiento de docentes en casos extremos → Corregido añadiendo constraint de disponibilidad docente  
- El evaluador de calidad no penalizaba correctamente los huecos de más de 2 horas → Corregido ajustando la función de costo  
- Control de roles: el rol coordinador podía acceder a endpoints de admin → Corregido en el middleware de autorización  
- Vista de horario generado no actualizaba en tiempo real al cambiar de semana → Corregido con invalidación de caché en frontend  

**Defectos corregidos:** 4 (100% resueltos)

---

### Riesgos

| Riesgo | Responsable | Mitigación Aplicada |
|--------|-------------|---------------------|
| Complejidad del motor CSP superando el tiempo estimado (R05) | Sulla | Se implementó primero backtracking puro como base funcional, luego se añadió forward checking para optimización. Se realizaron 3 iteraciones de refinamiento |
| Rendimiento: tiempo de generación mayor a 50 segundos (R06) | Rafael / Sulla | Se añadió indexación en las tablas de restricciones en PostgreSQL. Resultado final: 32 segundos para 200 estudiantes |
| Concentración del trabajo en los últimos días del sprint (R16) | Equipo | La revisión de avance a mitad de sprint (Semana 2) permitió detectar retrasos en SGDHA-8 y reasignar esfuerzo |

---

### Próximos Avances (Sprint 4 – 08/06/2026 al 18/06/2026)

- **Implementar exportación de horarios a PDF**  
  *(Responsable: Reyes – Fecha estimada: 15/06/2026)*
- **Optimizar la carga de horarios en el frontend (lazy loading, caché)**  
  *(Responsable: Vilcahuaman – Fecha estimada: 15/06/2026)*
- **Implementar pruebas unitarias con cobertura ≥ 70% (Cypress + pytest)**  
  *(Responsable: Sulla – Fecha estimada: 18/06/2026)*
- **Implementar dashboard de métricas de Green Software (consumo CO₂)**  
  *(Responsable: Rafael – Fecha estimada: 18/06/2026)*
- Preparar documentación final: informe técnico, video demostrativo, tag v1.0.0 en GitHub

---

### Notas

- Este sprint marcó un hito crítico del proyecto: la primera generación exitosa de horarios académicos mediante el algoritmo CSP. El equipo validó el resultado con el escenario de prueba definido en el Project Charter.
- La coordinación entre Sulla (motor CSP en backend) y Vilcahuaman (evaluador de calidad) fue clave para asegurar que el sistema no solo genere horarios válidos sino también optimizados.
- Se actualizó la documentación Swagger/OpenAPI con los nuevos endpoints del Sprint 3 (generación y evaluación de horarios).
- No hay impedimentos bloqueantes al cierre del sprint.
- **Velocidad acumulada:** Sprint 1: 17 SP | Sprint 2: 16 SP | Sprint 3: 18 SP → Promedio: 17 SP/sprint
