# **Declaración de la Visión del Proyecto**

Título del Proyecto:

Generación Óptima de Horarios Académicos para Currículos Flexibles

## **1\. Problema**

Actualmente, los coordinadores académicos invierten semanas elaborando horarios de forma manual, generando conflictos de solapamiento, incumplimiento de disponibilidad de docentes y aulas, y una experiencia deficiente para estudiantes que enfrentan horarios inconsistentes con sus prerrequisitos y límite de créditos. En currículos flexibles, la variabilidad de matrícula agrava el problema, haciendo inviable una solución manual eficiente.

## **2\. Visión**

"Proveer a coordinadores académicos, docentes y estudiantes de una plataforma web inteligente que genere horarios universitarios óptimos, respetando restricciones académicas, operativas y de recursos, reduciendo conflictos de horarios y mejorando la experiencia educativa en entornos de currículo flexible."

## **3\. Valor Propuesto**

* Para coordinadores: Reducción del tiempo de planificación de horarios de semanas a minutos.  
* Para estudiantes: Horarios sin solapamientos, que respetan prerrequisitos y límite de créditos (máximo 6 créditos por semestre).  
* Para docentes: Asignación de horarios que respeta su disponibilidad.  
* Para la universidad: Uso eficiente de aulas y recursos, equidad en la asignación.

## **4\. Objetivos Estratégicos**

* OE1: Automatizar la generación de horarios para reducir el tiempo de planificación en al menos un 90% respecto al proceso manual.  
* OE2: Garantizar el 100% de cumplimiento de restricciones obligatorias (prerrequisitos, disponibilidad, solapamiento, capacidad de aula).  
* OE3: Proveer una interfaz usable que alcance ≥80 puntos en la escala SUS (System Usability Scale).

## **5\. Alcance del Producto Mínimo Viable (PMV)**

El PMV incluirá:

* Registro y gestión de estudiantes, docentes, cursos y aulas.  
* Validación de matrícula (créditos máximo 6 créditos por semestre, prerrequisitos).  
* Generación automática de un horario válido usando un algoritmo CSP.  
* Visualización del horario generado (vista semanal).  
* Autenticación básica (JWT) con roles: administrador, estudiante, coordinador, docente (según restricciones de dominio).

## **6\. Métricas de Éxito**

| Métrica | Objetivo | Condición |
| :---- | :---- | :---- |
| Tiempo de generación | \< 30 segundos | Para un escenario de prueba de 500 estudiantes, 30 cursos, 20 docentes, medido en entorno de desarrollo (CPU 2.5GHz, 8GB RAM). |
| Cumplimiento de restricciones | 100% | De las restricciones obligatorias (prerrequisitos, disponibilidad docente/aula, solapamiento, capacidad). |
| Usabilidad | ≥ 80 puntos | En prueba SUS aplicada a 5 usuarios representantes de cada rol al final del Sprint 2\. |
| Entregable temporal | Completado | Para la fecha de entrega del PFA (Sprint final). |

## **7\. Restricciones conocidas**

* El algoritmo CSP priorizará encontrar una solución válida sobre la óptima si el tiempo de cómputo supera los 30 segundos.  
* El PMV no incluirá generación multiobjetivo (ej. minimizar huecos horarios), solo horario válido.