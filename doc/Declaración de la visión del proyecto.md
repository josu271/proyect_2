# **Declaración de la Visión del Proyecto**

## **Título del Proyecto: Generación Óptima de Horarios Académicos para Currículos Flexibles**

## **Visión**

"Proveer a coordinadores académicos, docentes y estudiantes de una plataforma web inteligente que genere horarios universitarios óptimos, respetando restricciones académicas, operativas y de recursos, reduciendo conflictos de horarios y mejorando la experiencia educativa en entornos de currículo flexible."

## **Valor Propuesto**

* **Para coordinadores:** Reducción del tiempo de planificación de horarios de semanas a minutos.  
* **Para estudiantes:** Horarios sin solapamientos, que respetan prerrequisitos y límite de créditos.  
* **Para docentes:** Asignación de horarios que respeta su disponibilidad.  
* **Para la universidad:** Uso eficiente de aulas y recursos, equidad en la asignación.

  ## **Alcance del Producto Mínimo Viable (PMV)**

El PMV incluirá:

* Registro y gestión de estudiantes, docentes, cursos y aulas.  
* Validación de matrícula (créditos 20-22, prerrequisitos).  
* Generación automática de un horario válido usando un algoritmo CSP.  
* Visualización del horario generado (vista semanal).  
* Autenticación básica (JWT) con roles: administrador, estudiante.

  ## **Métricas de Éxito**

* El sistema genera un horario válido en \< 30 segundos para una facultad de 500 estudiantes, 30 cursos, 20 docentes.  
* 100% de las restricciones obligatorias se cumplen.  
* Interfaz usable (supera 80% en prueba SUS – System Usability Scale).