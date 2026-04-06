# **Documento Inicial del Problema – Primer Borrador**

## **1\. Descripción del Problema Central**

Las universidades con currículo flexible (donde los estudiantes eligen cursos libremente dentro de un plan de estudios) enfrentan una complejidad combinatorial al generar horarios académicos. Cada período de matrícula, los coordinadores deben asignar cursos a aulas, docentes y franjas horarias, respetando:

* Prerrequisitos de los cursos.  
* Límite de créditos por estudiante (20-22).  
* Disponibilidad de docentes.  
* Capacidad y disponibilidad de aulas.  
* No solapamiento de horarios para un mismo estudiante/docente/aula.

Este problema es un **Problema de Satisfacción de Restricciones (CSP)** de alta complejidad (NP-hard). Actualmente, muchas universidades lo resuelven manualmente con hojas de cálculo, lo que toma semanas y produce horarios subóptimos (conflictos, aulas subutilizadas).

## **2\. Variables Identificadas**

| Variable | Descripción | Dominio |
| :---- | :---- | :---- |
| Cursos | Conjunto de asignaturas ofertadas | Dado por entrada |
| Docentes | Profesores que dictan cursos | Dado por entrada |
| Estudiantes | Alumnos que se matriculan | Dado por entrada |
| Aulas | Salones con capacidad y tipo | Dado por entrada |
| Franjas horarias | Bloques de tiempo (día \+ hora) | Lunes a viernes, 7:00-21:00, bloques de 1h |

## **3\. Actores (Stakeholders)**

| Actor | Interés | Influencia |
| :---- | :---- | :---- |
| Estudiante | Obtener horario sin conflictos, que cumpla prerrequisitos y créditos | Alta |
| Docente | Que su disponibilidad sea respetada | Alta |
| Coordinador académico | Generar horario rápido y que maximice uso de recursos | Muy Alta |
| Administrador | Gestionar datos maestros (cursos, aulas, usuarios) | Media |

## **4\. Ambigüedades Detectadas (requieren decisión)**

| Ambigüedad | Posibles interpretaciones | Decisión del equipo |
| :---- | :---- | :---- |
| ¿Se permiten cursos con múltiples horarios (teoría/lab)? | a) Un solo bloque por curso b) Múltiples bloques | **Decisión:** Por simplicidad en PMV, un curso \= un bloque horario. |
| ¿El límite de créditos es por estudiante o por programa? | a) Homogéneo 20-22 b) Variable por carrera | **Decisión:** Homogéneo 20-22 para todos. |
| ¿Se considera disponibilidad de estudiantes? | a) Sí, encuesta previa b) No, solo prerrequisitos | **Decisión:** Solo prerrequisitos y límite de créditos (no disponibilidad individual para PMV). |
| ¿Qué ocurre si no hay solución factible? | a) Mostrar error b) Relajar restricciones | **Decisión:** Mostrar error detallado indicando qué restricciones no se cumplen. |

## **5\. Restricciones Identificadas**

| Tipo | Restricción |
| :---- | :---- |
| Hard | Un estudiante no puede tener dos cursos en el mismo horario |
| Hard | Un docente no puede estar en dos aulas simultáneamente |
| Hard | Capacidad del aula \>= número de estudiantes del curso |
| Hard | Prerrequisitos: si curso A requiere curso B, B debe aprobarse antes |
| Hard | Créditos por estudiante entre 20 y 22 |
| Hard | Un aula solo puede tener un curso por franja horaria |
| Soft | Preferencia de horarios de docentes (se prioriza, no obligatorio) |

## **6\. Complejidad del Problema**

* Es un problema **NP-hard** (similar a graph coloring con recursos múltiples).  
* Para 30 cursos, 20 docentes, 500 estudiantes, el espacio de búsqueda es astronómico (\> 10^50 combinaciones).  
* Se requiere un algoritmo de búsqueda con poda (backtracking \+ forward checking) o heurísticas.