# **Registro de Supuestos y Restricciones**

Proyecto: Sistema de Generación Óptima de Horarios Académicos

## **1\. Priorización de restricciones**

| Prioridad | Tipo de restricción | Ejemplos | Consecuencia si se viola |
| :---- | :---- | :---- | :---- |
| Obligatoria (Hard) | Sin solapamiento | Mismo estudiante, docente o aula en dos cursos distintos a la misma hora | Horario inválido (no se acepta) |
| Obligatoria (Hard) | Prerrequisitos | Curso A requiere haber aprobado Curso B con nota ≥ 11.00 | Matrícula inválida |
| Obligatoria (Hard) | Límite de créditos | Máximo 6 créditos por semestre por estudiante | Matrícula inválida |
| Obligatoria (Hard) | Capacidad de aula | Sección con 25 estudiantes no puede asignarse a aula de 20 | Horario inválido |
| Deseable (Soft) | Preferencia horaria de docente | Docente prefiere no dar clase antes de 8:00 am | Se intenta respetar, pero se puede violar si no hay solución |
| Deseable (Soft) | Distribución equilibrada | Evitar que un docente tenga 6 horas seguidas de clase | Se penaliza en función objetivo, pero no invalida horario |

## **2\. Restricciones que inciden en el modelo de optimización de horarios**

### **2.1 Restricciones Técnicas**

| ID | Restricción | Impacto en el modelo | Estrategia de mitigación |
| ----- | ----- | ----- | ----- |
| RT-01 | Capacidad computacional limitada (sin GPU, ≤ 4GB RAM para algoritmo) | El espacio de búsqueda debe podarse agresivamente; no se puede usar fuerza bruta | Implementar forward checking \+ heurística MRV (Minimum Remaining Values) |
| RT-02 | Tiempo máximo de generación ≤ 50 segundos (según métrica de éxito del Project Charter) | El algoritmo debe ser completo pero no necesariamente óptimo (primera solución válida) | Usar backtracking con ordenamiento dinámico de variables |
| RT-03 | PostgreSQL como única BD (no soporte nativo para grafos) | Las restricciones de prerrequisitos deben modelarse con joins recursivos o lógica en aplicación | Implementar validación de prerrequisitos en capa de servicios (Python) |
| RT-04 | API REST stateless (JWT) | No se puede mantener estado de búsqueda entre peticiones | El motor CSP se ejecuta en un solo request; no requiere estado distribuido |

### **2.2 Restricciones Operativas**

| ID | Restricción | Impacto en el modelo | Estrategia de mitigación |
| ----- | ----- | ----- | ----- |
| RO-01 | Un curso tiene un único horario (supuesto S-03) | El modelo no maneja secciones múltiples ni teoría/laboratorio separado | Para PMV, se asigna un solo bloque horario por curso |
| RO-02 | Los docentes ingresan disponibilidad en bloques de 1 hora | El dominio horario es discreto (7:00-21:00, bloques de 1h, L-V) | Variables de tiempo definidas como tuplas (día, hora) |
| RO-03 | Límite de créditos homogéneo (máximo 6 créditos para todos los estudiantes) | No hay variabilidad por programa académico | El validador de matrícula usa el mismo límite para todos |
| RO-04 | Las aulas solo tienen restricción de capacidad (sin tipos especializados en PMV) | No se modelan restricciones de "laboratorio requiere aula con equipo especial" | Atributo `tipo_aula` se incluye en diseño pero no se valida en PMV |

### **2.3 Restricciones de Negocio**

| ID | Restricción | Impacto en el modelo | Estrategia de mitigación |
| ----- | ----- | ----- | ----- |
| RN-01 | Plazo fijo de 16 semanas para entregar PMV (Sprint 0 \+ 4 Sprints, equipo de 4 integrantes) | No se puede implementar algoritmo óptimo (ej. programación lineal entera completa) | Se prioriza CSP con heurísticas sobre optimización global |
| RN-02 | Evaluación basada en rúbrica con criterios de "Sobresaliente" | Se debe evidenciar modelo formal (CSP \+ optimización) en documentación | Documento separado de modelado (formulación matemática) |
| RN-03 | Debe cumplir OWASP Top 10 | Los datos sensibles (horarios, matrícula) deben protegerse | JWT con expiración, validación de inputs, prepared statements |
| RN-04 | Debe cumplir WCAG 2.1 AA | La interfaz debe ser navegable por teclado y con contraste adecuado | Uso de Tailwind con paleta validada y componentes semánticos |

### **2.4 Restricciones de Datos (nuevo, basado en su listado inicial)**

| ID | Restricción | Impacto en el modelo |
| ----- | ----- | ----- |
| RD-01 | Identificación única: estudiantes y docentes tienen ID único | Permite asociar horarios a personas sin ambigüedad |
| RD-02 | Email único por usuario | Base para autenticación JWT |
| RD-03 | Código único para cursos, aulas, semestres | Permite identificar entidades en el CSP sin conflictos de nombres |
| RD-04 | Tipos de conflicto y severidad predefinidos (LOW, MEDIUM, HIGH) | Facilita reporte de horarios no válidos durante depuración |
| RD-05 | Operaciones de auditoría (INSERT, UPDATE, DELETE) con historial | Permite trazabilidad de cambios en horarios |

## **3\. Supuestos**

| ID | Supuesto | Justificación | Impacto en optimización |
| ----- | ----- | ----- | ----- |
| S-01 | No hay restricciones de disponibilidad de estudiantes (solo prerrequisitos y créditos) | Simplificación para PMV; reduce variables del CSP en un factor N\_estudiantes | El CSP tiene \~30-50 variables (cursos) en lugar de miles |
| S-02 | Todos los cursos tienen la misma duración (1 bloque \= 1 hora) | Evita manejar cursos de 2 o 3 horas continuas | El dominio horario es uniforme |
| S-03 | Cada curso tiene exactamente un docente asignado | Evita co-docencia o equipos docentes | Restricción unaria: curso → docente |
| S-04 | Los datos de entrada serán proporcionados en formato CSV/JSON | No se requiere UI de carga masiva en PMV | El equipo puede enfocarse en algoritmo |
| S-05 | No hay solapamiento entre horarios de estudiantes porque se valida individualmente con el CSP | En realidad, estudiantes comparten cursos; esta validación es suficiente | El CSP garantiza que ningún estudiante tenga conflictos a través de la matriz estudiante-curso |

