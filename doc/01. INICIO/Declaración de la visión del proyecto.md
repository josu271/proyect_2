# **Declaración de la Visión del Proyecto**

**Título del Proyecto:** Generación Óptima de Horarios Académicos para Currículos Flexibles

## 1\. Problema

Actualmente, los coordinadores académicos invierten semanas elaborando horarios de forma manual, generando conflictos de solapamiento, incumplimiento de disponibilidad de docentes y aulas, y una experiencia deficiente para estudiantes que enfrentan horarios inconsistentes con sus prerrequisitos y límite de créditos. En currículos flexibles, la variabilidad de matrícula agrava el problema, haciendo inviable una solución manual eficiente.

## 2\. Visión

"Proveer a coordinadores académicos, docentes y estudiantes de una plataforma web inteligente que genere horarios universitarios óptimos, respetando restricciones académicas, operativas y de recursos, reduciendo conflictos de horarios y mejorando la experiencia educativa en entornos de currículo flexible."

## 3\. Valor Propuesto

| Stakeholder | Valor |
| ----- | ----- |
| **Coordinadores** | Reducción del tiempo de planificación de semanas a minutos |
| **Estudiantes** | Horarios sin solapamientos, respetando prerrequisitos y límite de créditos (≤6) |
| **Docentes** | Asignación que respeta su disponibilidad declarada |
| **Universidad** | Uso eficiente de aulas y recursos, equidad en la asignación |

## 4\. Objetivos Estratégicos

* OE1 Automatizar la generación de horarios con una reducción ≥90% del tiempo manual  
* OE2 Garantizar cumplimiento de restricciones duras  
* OE3 Proveer interfaz usable en  ≥80 puntos en escala SUS  
* OE4 Delimitar como Prueba de Concepto (PoC) mediante el volumen controlado: 200 estudiantes, 30 cursos

  ## 5\. Alcance del Producto Mínimo Viable (PMV) como Prueba de Concepto (PoC)

  ### **Incluido en el PMV:**

* Registro y gestión de estudiantes, docentes, cursos y aulas  
* Validación de matrícula (créditos ≤6, prerrequisitos con nota ≥11.00/20)  
* Generación automática de horario válido usando algoritmo CSP (backtracking \+ forward checking \+ MRV)  
* Visualización semanal (L-V, 7:00-21:00) por rol  
* Autenticación JWT con 4 roles (admin, coordinador, docente, estudiante)

  ### Supuestos controlados (PoC):

| Supuesto | Valor |
| ----- | ----- |
| Volumen máximo de datos | 30 cursos, 20 docentes, 200 estudiantes, 15 aulas |
| Horizonte de planificación | 1 semestre académico (16 semanas) |
| Franjas horarias | Lunes a viernes, 7:00-21:00 (bloques de 1 hora) |
| Duración de cursos | 1 bloque horario por curso (sin teoría/lab separado) |

  ### Limitaciones de generalización:

* No se soportan múltiples sedes  
* No se soportan cursos con múltiples bloques horarios  
* No se modela disponibilidad de estudiantes (solo prerrequisitos y créditos)

  ## 6\. KPIs para Evaluar la Calidad de la Solución

| KPI | Fórmula | Objetivo |
| :---- | :---- | :---- |
| **Tasa de conflictos** | Conflictos encontrados / Total asignaciones | 0% |
| **Tiempo de generación** | Tiempo desde request hasta respuesta | ≤ 50 segundos |
| **Nivel de ocupación** | Σ inscritos / Σ capacidad × 100% | \> 70% |
| **Satisfacción de restricciones blandas** | Σ (soft constraints cumplidas × peso) / Σ pesos | ≥ 80% |
| **Cobertura de pruebas** | Líneas de código ejecutadas en tests | ≥ 70% |

