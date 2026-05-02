# **Documento Inicial del Problema**

## **1\. Problema General**

Las universidades con currículo flexible permiten a los estudiantes elegir cursos libremente dentro de un plan de estudios. Sin embargo, la planificación de horarios académicos en este contexto presenta dificultades significativas porque:

* La matrícula estudiantil es altamente variable cada período  
* Existen múltiples restricciones interdependientes (prerrequisitos, créditos, disponibilidad, capacidad)  
* Los métodos actuales no garantizan horarios sin conflictos  
* Es un problema NP-hard de optimización combinatoria

## **2\. Stakeholders y sus molestias principales**

| Stakeholder | Molestias | Consecuencia |
| ----- | ----- | ----- |
| Estudiante | \- Horarios con solapamiento (dos cursos a la misma hora) \- No poder matricularse por no cumplir prerrequisitos \- Exceder o no alcanzar el límite de créditos (máximo 6 créditos) \- Horarios con huecos mal distribuidos | Deserción, retraso en la carrera, frustración |
| Docente | \- Horarios asignados sin respetar su disponibilidad declarada \- Clases en aulas inadecuadas (capacidad insuficiente, sin equipo) \- Múltiples cursos en el mismo horario | Insatisfacción laboral, baja calidad de enseñanza |
| Coordinador académico | \- Proceso manual que toma semanas de trabajo \- Dificultad para detectar conflictos antes de publicar horario \- Presión de estudiantes y docentes por ajustes de última hora | Estrés, horas extras no remuneradas, errores humanos |
| Administrador | \- Datos dispersos en múltiples sistemas o archivos \- Auditoría difícil de cumplir (acreditación, equidad) \- Quejas recurrentes que escalan a su nivel | Sobrecarga operativa, riesgo reputacional |
| Universidad (institución) | \- Aulas subutilizadas (capacidad vs. inscritos) \- Baja eficiencia en uso de recursos (energía, mantenimiento) \- Pérdida de estudiantes por mala experiencia en horarios | Sobre costos, desprestigio |

## **3\. Variables del sistema**

| Variable | Descripción | Dominio | Tipo |
| ----- | ----- | ----- | ----- |
| Cursos | Conjunto de asignaturas ofertadas en el período | Dado por entrada (ej. 30 cursos) | Discreto |
| Docentes | Profesores que dictan uno o más cursos | Dado por entrada (ej. 20 docentes) | Discreto |
| Estudiantes | Alumnos que se matriculan en cursos | Dado por entrada (ej. 500 estudiantes) | Discreto |
| Aulas | Salones con capacidad y tipo (normal/laboratorio) | Dado por entrada (ej. 15 aulas) | Discreto |
| FranjasHorarias | Bloques de tiempo disponibles | Lunes a viernes, 7:00 a 21:00, bloques de 1 hora (70 franjas) | Discreto |
| Matrícula | Relación Estudiante → Curso | Subconjunto de Cursos × Estudiantes | Discreto |
| Créditos por curso | Valor numérico de cada curso | Mínimo 1 crédito, máximo 6 créditos | Discreto |

## **4\. Restricciones del problema**

### **Restricciones Duras (Hard)**

| ID | Restricción | Descripción | Afecta a |
| ----- | ----- | ----- | ----- |
| H-01 | No solapamiento estudiante | Un estudiante no puede tener dos cursos en la misma franja horaria | Estudiante |
| H-02 | No solapamiento docente | Un docente no puede dictar dos cursos en la misma franja horaria | Docente |
| H-03 | No solapamiento aula | Un aula no puede albergar dos cursos en la misma franja horaria | Aula |
| H-04 | Prerrequisitos | Si el curso A tiene como prerrequisito el curso B, el estudiante debe haber aprobado B con nota ≥ 11.00/20 antes de matricular A | Estudiante |
| H-05 | Límite de créditos | La suma de créditos de los cursos matriculados por un estudiante debe ser ≤ 6 créditos por semestre | Estudiante |
| H-06 | Capacidad de aula | El número de estudiantes inscritos en un curso no puede superar la capacidad del aula asignada (mínimo 15, máximo 40\) | Aula, Curso |
| H-07 | Disponibilidad docente | El horario asignado a un curso debe estar dentro de la disponibilidad declarada por el docente (MAÑANA o TARDE) | Docente |
| H-08 | Nota mínima aprobatoria | Un curso aprobado requiere calificación ≥ 11.00/20 para ser considerado como prerrequisito cumplido | Estudiante |

### **Restricciones Blandas (Soft)**

| ID | Restricción | Descripción | Stakeholder |
| ----- | ----- | ----- | ----- |
| S-01 | Preferencia horaria docente | Priorizar franjas que el docente marcó como "preferidas" | Docente |
| S-02 | Continuidad horaria | Evitar huecos largos entre cursos para un mismo estudiante | Estudiante |
| S-03 | Uso eficiente de aulas | Priorizar asignar cursos grandes a aulas grandes | Coordinador |
| S-04 | Distribución equitativa | Evitar que un mismo docente tenga todos sus cursos en horarios tempranos (7am) | Coordinador |

## **5\. Reporte de conflictos**

| Tipo de conflicto | Severidad | Descripción |
| ----- | ----- | ----- |
| CLASSROOM\_OVERLAP | HIGH | Dos cursos asignados a la misma aula en el mismo horario |
| TEACHER\_OVERLAP | HIGH | Un docente asignado a dos cursos en el mismo horario |
| STUDENT\_OVERLAP | HIGH | Un estudiante matriculado en dos cursos que se dictan en el mismo horario |
| CAPACITY\_EXCEEDED | MEDIUM | El número de estudiantes excede la capacidad del aula |
| TEACHER\_UNAVAILABLE | MEDIUM | Curso asignado fuera del bloque de disponibilidad del docente (MAÑANA/TARDE) |
| CLASSROOM\_UNAVAILABLE | LOW | Aula asignada fuera de su disponibilidad operativa |

## **6\. Ambigüedades detectadas y decisiones tomadas** 

| Ambigüedad | Posibles interpretaciones | Decisión del equipo (Sprint 0\) |
| ----- | ----- | ----- |
| ¿Se permiten cursos con múltiples bloques horarios? | a) Un solo bloque por curso b) Múltiples bloques | Un curso \= un bloque horario para PMV |
| ¿El límite de créditos es por estudiante o por programa? | a) Homogéneo para todos b) Variable por carrera | Homogéneo: máximo 6 créditos por semestre |
| ¿Se considera disponibilidad de estudiantes? | a) Sí b) No, solo prerrequisitos y créditos | No para PMV (solo prerrequisitos \+ créditos) |
| ¿Qué ocurre si no hay solución factible? | a) Mostrar error genérico b) Reporte detallado de conflictos | Reporte detallado con tipo y severidad de conflicto |
| ¿El aula tipo laboratorio es obligatorio para ciertos cursos? | a) Sí, restricción dura b) No, solo preferencia | No en PMV (se agrega en iteración futura) |
| ¿Qué nota mínima se requiere para aprobar un curso? | a) 10.00/20 b) 11.00/20 c) Configurable | 11.00/20 (según restricciones de negocio definidas) |

## **7\. Complejidad del problema**

* Clase de complejidad: NP-hard (similar a graph coloring con recursos múltiples)  
* Tamaño del espacio de búsqueda (caso típico): Para 30 cursos, 20 docentes, 15 aulas, 70 franjas horarias → aproximadamente (70 × 15)^30 combinaciones  
* Enfoque de resolución: Backtracking \+ forward checking \+ heurística MRV (Minimum Remaining Values)

## **8\. Impacto si no se resuelve**

| Stakeholder | Impacto negativo |
| ----- | ----- |
| Estudiante | Atraso en graduación, sobrecarga académica, deserción |
| Docente | Insatisfacción laboral, renuncias |
| Coordinador | Horas extras, estrés crónico |
| Universidad | Pérdida de acreditación, quejas, costos operativos altos |

