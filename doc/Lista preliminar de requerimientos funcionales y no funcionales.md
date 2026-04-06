# **Lista Preliminar de Requerimientos Funcionales y No Funcionales**

## **Requerimientos Funcionales (RF)**

| ID | Requerimiento | Descripción | Prioridad |
| :---- | :---- | :---- | :---- |
| **RF-01** | **Gestión de cursos** | **CRUD de cursos: código, nombre, créditos, prerrequisitos (lista), docente asignado** | **Alta** |
| **RF-02** | **Gestión de docentes** | **CRUD de docentes: nombre, email, disponibilidad horaria (día/hora)** | **Alta** |
| **RF-03** | **Gestión de aulas** | **CRUD de aulas: código, capacidad, tipo (aula normal, laboratorio)** | **Alta** |
| **RF-04** | **Gestión de estudiantes** | **CRUD de estudiantes: nombre, email, programa, límite de créditos (20-22)** | **Alta** |
| **RF-05** | **Matrícula de cursos** | **Estudiante selecciona cursos para el período. Validación automática de prerrequisitos y créditos** | **Alta** |
| **RF-06** | **Generación automática de horarios** | **Sistema produce un horario válido (todas las restricciones duras satisfechas)** | **Alta** |
| **RF-07** | **Visualización de horarios** | **Vista semanal (tabla días vs horas) para estudiante, docente y aula** | **Alta** |
| **RF-08** | **Autenticación y roles** | **Login con JWT. Roles: Administrador, Coordinador, Estudiante, Docente** | **Media** |
| **RF-09** | **Exportar horario** | **Opción de exportar a PDF o imagen** | **Baja** |

## **Requerimientos No Funcionales (RNF) – Basados en ISO/IEC 25010**

| ID | Categoría | Requerimiento | Métrica |
| :---- | :---- | :---- | :---- |
| **RNF-01** | **Rendimiento** | **El algoritmo de generación de horarios debe ejecutarse en menos de 30 segundos para 30 cursos, 20 docentes** | **Tiempo \< 30s** |
| **RNF-02** | **Escalabilidad** | **La API debe soportar al menos 50 peticiones concurrentes sin degradación \> 20%** | **Prueba de carga con k6** |
| **RNF-03** | **Usabilidad** | **La interfaz debe cumplir WCAG 2.1 nivel AA** | **Evaluación con Lighthouse (score \> 90\)** |
| **RNF-04** | **Seguridad** | **Cumplir OWASP Top 10 (autenticación JWT, prevención SQL injection, XSS)** | **Escaneo con OWASP ZAP sin hallazgos críticos** |
| **RNF-06** | **Disponibilidad** | **El sistema debe estar disponible 90% del tiempo en horario de evaluación** | **Monitoreo simple** |
| **RNF-07** | **Eficiencia energética (Green Software)** | **Optimizar consultas SQL y evitar procesamiento innecesario** | **Consultas \< 50ms, CPU idle \> 80%** |

## 

### **TABLA 1: PRODUCT BACKLOG DETALLADO**

| Prioridad | ID | Épica Relacionada | Nombre (Alias) | Descripción (User Story) | Criterios de Aceptación (Gherkin) | Puntos (Fibonacci) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | HU01 | Gestión Académica | Registrar estudiantes | Como administrador quiero registrar estudiantes para gestionar matrícula | 1\. Dado un formulario válido cuando registro estudiante entonces se guarda correctamente 2\. Dado un ID duplicado cuando registro entonces el sistema rechaza | 3 |
| 2 | HU02 | Gestión Académica | Registrar docentes | Como administrador quiero registrar docentes para asignarlos a cursos | 1\. Dado datos válidos cuando registro docente entonces se almacena correctamente 2\. Dado datos incompletos cuando registro entonces se muestra error | 3 |
| 3 | HU03 | Gestión Académica | Registrar cursos | Como administrador quiero registrar cursos para ofertarlos en el sistema | 1\. Dado curso válido cuando registro entonces se guarda 2\. Dado curso duplicado cuando registro entonces se rechaza | 3 |
| 4 | HU04 | Gestión Académica | Registrar aulas | Como administrador quiero registrar aulas para asignar espacios físicos | 1\. Dado aula válida cuando registro entonces se almacena 2\. Dado capacidad inválida cuando registro entonces se rechaza | 2 |
| 5 | HU05 | Matrícula | Validar prerrequisitos | Como sistema quiero validar prerrequisitos para asegurar consistencia académica | 1\. Dado curso con prerrequisitos cuando valida entonces verifica cumplimiento 2\. Dado incumplimiento cuando valida entonces rechaza matrícula | 5 |
| 6 | HU06 | Matrícula | Validar créditos | Como sistema quiero validar límite de créditos para evitar sobrecarga | 1\. Dado créditos \> límite cuando valida entonces rechaza 2\. Dado créditos válidos cuando valida entonces aprueba | 3 |
| 7 | HU07 | Gestión de Validación de Horarios | Definir restricciones | Como administrador quiero definir restricciones para controlar generación de horarios | 1\. Dado restricciones válidas cuando guardo entonces quedan registradas 2\. Dado conflicto lógico cuando guardo entonces se rechaza | 5 |
| 8 | HU08 | Gestión de Validación de Horarios | Generar horarios | Como administrador quiero generar horarios automáticamente para optimizar recursos | 1\. Dado datos válidos cuando genero entonces no hay conflictos 2\. Dado falta de recursos cuando genero entonces se notifica error | 13 |
| 9 | HU09 | Gestión de Validación de Horarios | Evaluar horario | Como sistema quiero evaluar calidad del horario para medir optimalidad | 1\. Dado horario generado cuando evalúo entonces devuelve puntaje 2\. Dado criterios definidos cuando evalúo entonces calcula correctamente | 5 |
| 10 | HU10 | Visualización | Ver horarios | Como usuario quiero visualizar horarios para consultar mis clases | 1\. Dado usuario autenticado cuando consulta entonces ve su horario 2\. Dado sin datos cuando consulta entonces muestra mensaje vacío | 3 |
| 11 | HU11 | Visualización | Exportar horarios | Como usuario quiero exportar horarios para uso externo | 1\. Dado horario disponible cuando exporto entonces descarga archivo 2\. Dado error de generación cuando exporto entonces muestra mensaje | 3 |
| 12 | HU12 | Seguridad | Autenticación usuarios | Como usuario quiero iniciar sesión para acceder al sistema | 1\. Dado credenciales válidas cuando inicio sesión entonces accedo 2\. Dado credenciales inválidas cuando intentó entonces se rechaza | 5 |
| 13 | HU13 | Seguridad | Autorización roles | Como sistema quiero controlar accesos por rol para proteger información | 1\. Dado rol definido cuando accede entonces permite acciones autorizadas 2\. Dado rol restringido cuando accede entonces deniega acceso | 5 |
| 14 | HU14 | Rendimiento y Mantenibilidad | Optimizar consultas | Como sistema quiero optimizar consultas para reducir latencia  | 1\. Dado consulta cuando ejecuto entonces responde \<1s 2\. Dado alta carga cuando ejecuto entonces mantiene rendimiento | 8 |
| 15 | HU15 | Rendimiento y Mantenibilidad | Pruebas unitarias | Como desarrollador quiero pruebas unitarias para asegurar calidad | 1\. Dado código nuevo cuando pruebo entonces cobertura ≥80% 2\. Dado fallo cuando pruebo entonces detecta errores | 5 |

### TABLA 2: PLANIFICACIÓN DE SPRINTS

| Sprint | Capacidad Total | ID de Historias Incluidas | Suma de Puntos |
| :---- | :---- | :---- | ----- |
| Sprint 1 | 30 pts | HU01, HU02, HU03, HU04, HU05, HU06, HU12, HU10 | 30 |
| Sprint 2 | 30 pts | HU07, HU08, HU09, HU11, HU13, HU14, HU15 | 44 |

### TABLA 3: RELEASE PLAN (VERSIONAMIENTO)

| Versión | Objetivo de la Entrega | Historias Incluidas |
| :---- | :---- | :---- |
| v1.0 (MVP) | Gestión básica \+ generación inicial de horarios | HU01, HU02, HU03, HU04, HU05, HU06, HU08, HU10, HU12 |
| v1.1 | Optimización avanzada, seguridad y calidad | HU07, HU09, HU11, HU13, HU14, HU15 |

