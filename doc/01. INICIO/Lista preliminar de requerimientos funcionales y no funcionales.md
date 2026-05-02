# **Lista Preliminar de Requerimientos Funcionales y No Funcionales**

## **Requerimientos Funcionales (RF)**

| ID | Actor(es) | Requerimiento (SMART) | Criterio de aceptación | Prioridad |
| ----- | ----- | ----- | ----- | ----- |
| RF-01 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar cursos con código único, nombre, créditos (1-6), lista de prerrequisitos y docente asignado, para el Sprint 1 | 100% de operaciones CRUD funcionan con validaciones | Alta |
| RF-02 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar docentes con nombre, email único y disponibilidad horaria (día/hora, bloques MAÑANA/TARDE), para el Sprint 1 | 100% de operaciones CRUD funcionan con validaciones | Alta |
| RF-03 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar aulas con código único, capacidad (15-40 estudiantes) y tipo (normal/laboratorio), para el Sprint 1 | 100% de operaciones CRUD funcionan con validaciones | Alta |
| RF-04 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar estudiantes con nombre, email único, programa y límite de créditos (máximo 6 créditos por semestre), para el Sprint 1 | 100% de operaciones CRUD funcionan con validaciones | Alta |
| RF-05 | Estudiante | El estudiante debe poder seleccionar cursos para matricularse, y el sistema debe validar automáticamente: (a) cumplimiento de prerrequisitos (nota ≥ 11.00/20) y (b) suma de créditos ≤ 6, para el Sprint 1 | Validación rechaza matrícula inválida con mensaje claro | Alta |
| RF-06 | Admin, Coordinador | El sistema debe generar un horario válido que cumpla el 100% de las restricciones duras (H-01 a H-08), en ≤ 50 segundos para 30 cursos, 20 docentes, 15 aulas, para el Sprint 2 | Horario sin conflictos; tiempo medido con time | Alta |
| RF-07 | Todos los roles | El sistema debe visualizar horarios en vista semanal (tabla días vs horas, L-V 7:00-21:00) filtrada por estudiante, docente o aula, para el Sprint 3 | Usuario ve su horario en \< 2 segundos | Alta |
| RF-08 | Todos los roles | El sistema debe autenticar usuarios con JWT y autorizar según rol (Admin, Coordinador, Docente, Estudiante), con expiración de token a las 8 horas, para el Sprint 2 | Usuario con rol incorrecto no accede a rutas protegidas | Media |
| RF-09 | Todos los roles | El sistema debe permitir exportar el horario a PDF en formato A4, para el Sprint 3 | Archivo PDF generado y descargable | Baja |

## 

## **Requerimientos No Funcionales (RNF)**

| ID | Categoría (ISO 25010\) | Requerimiento (SMART) | Métrica / Evidencia |
| ----- | ----- | ----- | ----- |
| RNF-01 | Rendimiento / Eficiencia | El algoritmo de generación de horarios debe ejecutarse en ≤ 50 segundos para un escenario de 30 cursos, 20 docentes, 15 aulas y 100 estudiantes, medido en entorno de desarrollo (CPU 2.5GHz, 8GB RAM), para el Sprint 2 | Tiempo medido con time en 3 ejecuciones; promedio ≤ 50s |
| RNF-02 | Escalabilidad | La API debe soportar 50 peticiones concurrentes sin que el tiempo de respuesta degrade más del 20% (ej. de 100ms a 120ms), para el Sprint 3 | Prueba de carga con k6: 50 VUs durante 60s |
| RNF-03 | Usabilidad | La interfaz debe cumplir WCAG 2.1 nivel AA (contraste, navegación por teclado, etiquetas ARIA), obteniendo \> 90 puntos en Lighthouse, para el Sprint 3 | Reporte Lighthouse generado en CI |
| RNF-04 | Seguridad | El sistema debe cumplir OWASP Top 10 (JWT con expiración, prevención de SQL injection con SQLAlchemy, sanitización de inputs, HTTPS en despliegue), para el Sprint 2 | Escaneo con OWASP ZAP sin hallazgos críticos (severidad ≥MEDIUM) |
| RNF-05 | Disponibilidad | El sistema debe estar disponible el 90% del tiempo durante las horas de evaluación del docente (9:00-18:00, L-V), para el Sprint 4 | Monitoreo con UptimeRobot o similar |
| RNF-06 | Rendimiento | La visualización de horarios (vista semanal) debe cargarse en \< 2 segundos para cualquier rol, para el Sprint 3 | Lighthouse / DevTools |
| RNF-07 | Escalabilidad | El motor CSP debe poder ejecutarse en paralelo para múltiples facultades (al menos 3 instancias simultáneas) sin degradación significativa, para el Sprint 4 | Prueba con 3 procesos CSP concurrentes |
| RNF-08 | Mantenibilidad | El proyecto debe incluir un README.md con TOC y una carpeta /docs con toda la documentación técnica actualizada, para el Sprint 0 | Verificación manual |
| RNF-09 | Trazabilidad | Los commits deben seguir el estándar Conventional Commits (feat:, fix:, docs:, test:, chore:), para todo el desarrollo | Verificación en cada PR |

### 

## **TABLA 1: PRODUCT BACKLOG DETALLADO**

| ID | Épica | Nombre | Descripción (User Story) | Criterios de Aceptación (Gherkin) | Pts |
| ----- | ----- | ----- | ----- | ----- | :---: |
| HU01 | Gestión | Registrar estudiantes | Como admin quiero registrar estudiantes | Dado datos válidos → se guarda; Dado ID duplicado → rechaza | **3** |
| HU02 | Gestión | Registrar docentes | Como admin quiero registrar docentes | Dado datos válidos → se guarda; Dato incompleto → error | **3** |
| HU03 | Gestión | Registrar cursos | Como admin quiero registrar cursos | Dato válido → guarda; Duplicado → rechaza | **3** |
| HU04 | Gestión | Registrar aulas | Como admin quiero registrar aulas | Dato válido → guarda; Capacidad inválida → rechaza | **2** |
| HU05 | Matrícula | Validar prerrequisitos | Como sistema quiero validar prerrequisitos | Curso con prerrequisitos → verifica; Incumplimiento → rechaza | **5** |
| HU06 | Matrícula | Validar créditos | Como sistema quiero validar límite de créditos (≤6) | Créditos \>6 → rechaza; Créditos ≤6 → aprueba | **3** |
| HU07 | Horarios | Definir restricciones | Como admin quiero definir restricciones | Válidas → guarda; Conflicto lógico → rechaza | **5** |
| HU08 | Horarios | Generar horarios | Como admin quiero generar horarios automáticamente | Datos válidos → sin conflictos; Sin solución → notifica error | **8** |
| HU09 | Horarios | Evaluar calidad | Como sistema quiero evaluar calidad del horario | Horario generado → devuelve puntaje; Criterios definidos → calcula correctamente | **5** |
| HU10 | Visualización | Ver horarios | Como usuario quiero visualizar mi horario | Autenticado → ve su horario; Sin datos → mensaje vacío | **3** |
| HU11 | Visualización | Exportar horarios | Como usuario quiero exportar horario a PDF | Horario disponible → descarga; Error → mensaje | **3** |
| HU12 | Seguridad | Autenticación | Como usuario quiero iniciar sesión | Credenciales válidas → accede; Inválidas → rechaza | **5** |
| HU13 | Seguridad | Autorización por roles | Como sistema quiero controlar accesos por rol | Rol definido → permite acciones autorizadas; Restringido → deniega | **5** |
| HU14 | Rendimiento | Optimizar consultas | Como sistema quiero optimizar consultas SQL | Consulta ejecuta en \<1s; Alta carga → mantiene rendimiento | **8** |
| HU15 | Calidad | Pruebas unitarias | Como desarrollador quiero pruebas unitarias | Código nuevo → cobertura ≥70%; Fallo → detecta errores | **5** |

## 

## **TABLA 2: PLANIFICACIÓN DE SPRINTS**

| Sprint | Fecha Inicio | Fecha Fin | Capacidad Total | ID de Historias | Suma de Puntos |
| :---- | :---- | :---- | :---- | :---- | ----- |
| Sprint 1 | 23/03/2026 | 10/05/2026 | 25 pts | HU01, HU02, HU03, HU04, HU05, HU06, HU10 | **21** |
| Sprint 2 | 11/05/2026 | 31/05/2026 | 25 pts | HU07, HU08, HU12, HU13 | **23** |
| Sprint 3 | 01/06/2026 | 28/06/2026 | 25 pts | HU09, HU11, HU14, HU15 | **21** |
| Sprint 4 | 29/06/2026 | 12/07/2026 | 10 pts | HU16 (despliegue) \+ buffer | **3** |

## **TABLA 3: RELEASE PLAN (VERSIONAMIENTO)**

| Versión | Objetivo | Historias Incluidas | Fecha estimada |
| ----- | ----- | ----- | ----- |
| v0.1 \- Alpha | CRUD básico \+ validación de matrícula | HU01, HU02, HU03, HU04, HU05, HU06, HU10 | Fin Sprint 1 |
| v1.0 \- MVP | Generación automática de horarios válidos | HU07, HU08, HU12, HU13, HU16 (despliegue) | Fin Sprint 2 |
| v1.1 \- Mejoras | Optimización, calidad y exportación | HU09, HU11, HU14, HU15, HU16 | Fin Sprint 4 |

