## **Especificación De Requerimientos Del Software**

## **Stakeholders**

| Stakeholder | Rol |
| ----- | ----- |
| Estudiantes | Seleccionan cursos, visualizan horarios |
| Docentes | Dictan cursos según disponibilidad y carga académica |
| Coordinadores Académicos | Supervisan planificación y validación de horarios |
| Administradores | Gestionan recursos institucionales y configuración académica |

## **Requerimientos Funcionales (RF)**

| ID | Actor(es) | Requerimiento (SMART) | Criterio de aceptación | Prioridad |
| ----- | ----- | ----- | ----- | ----- |
| RF-01 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar estudiantes con nombre, email único, programa académico y límite de créditos. | 100% de operaciones CRUD funcionan correctamente con validaciones | Alta |
| RF-02 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar docentes con nombre, email único y disponibilidad horaria por bloques, para el Sprint 1 | CRUD funcional con validaciones de disponibilidad y duplicidad | Alta |
| RF-03 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar cursos con código único, créditos y prerrequisitos. | Cursos registrados correctamente sin duplicados | Alta |
| RF-04 | Admin | El sistema debe permitir crear, leer, actualizar y eliminar aulas indicando capacidad. | Aulas registradas correctamente respetando capacidad permitida | Alta |
| RF-05 | Estudiante | El sistema debe validar automáticamente prerrequisitos académicos antes de permitir la matrícula. | Matrícula inválida es rechazada mostrando mensaje claro | Alta |
| RF-06 | Estudiante | El sistema debe validar automáticamente el límite máximo de créditos configurado institucionalmente. | Los créditos superiores al límite permitido son rechazados. | Alta |
| RF-07 | Admin, Coordinador | El sistema debe generar horarios automáticamente respetando restricciones académicas, docentes y operativas. | Horario generado sin conflictos de docentes, aulas o estudiantes. | Alta |
| RF-08 | Usuario | El sistema debe visualizar horarios semanales filtrados por estudiante, docente o aula, para el Sprint 3 | Horarios visibles correctamente en menos de 2 segundos | Alta |
| RF-09 | Usuario | El sistema debe exportar horarios académicos en formato PDF. | PDF generado correctamente y descargable | Media |
| RF-10 | Sistema | El sistema debe minimizar horas muertas entre clases durante la generación automática de horarios. | Horarios compactos generados automáticamente. | Media |
| RF-11 | Sistema | El sistema debe considerar preferencias horarias de estudiantes y docentes durante la optimización. | Preferencias aplicadas correctamente. | Media |
| RF-12 | Coordinador | El sistema debe permitir reofertar cursos con alta tasa de desaprobación o alta demanda académica. | Cursos reofertados correctamente según historial académico. | Media |
| RF-13 | Sistema | El sistema debe balancear la carga horaria docente considerando horas administrativas y disponibilidad. | Distribución equilibrada de horas académicas | Media |
| RF-14 | Usuario | El sistema debe autenticar usuarios mediante JWT según roles institucionales, para el Sprint 2 | Usuarios acceden únicamente a funcionalidades autorizadas | Alta |
| RF-15 | Sistema | El sistema debe detectar y evitar solapamientos de horarios entre cursos, aulas, docentes y estudiantes. | Conflictos detectados automáticamente | Alta |
| RF-16  | Sistema | El sistema debe registrar y mantener historial académico de estudiantes para la planificación de oferta académica. | Historial almacenado correctamente. | Media |
| RF-17 | Coordinador | El sistema debe estimar demanda potencial de cursos según historial académico institucional. | Oferta académica generada considerando demanda estudiantil. | Media |
| RF-18 | Sistema | El sistema debe optimizar el uso de aulas considerando capacidad y tipo de ambiente. | Asignación eficiente de aulas  | Alta |

## 

## **Requerimientos No Funcionales (RNF)**

| ID | Categoría | Requerimiento (SMART) | Métrica / Evidencia |
| ----- | ----- | ----- | ----- |
| RNF-01 | Rendimiento | El algoritmo de generación de horarios debe ejecutarse en ≤ 50 segundos para escenarios institucionales estándar. | Tiempo promedio ≤ 50 segundos |
| RNF-02 | Usabilidad | La interfaz debe permitir visualización intuitiva y rápida de horarios académicos. Usuarios encuentran horarios en ≤ 3 clics. | Usuarios encuentran horarios en ≤ 3 clics. |
| RNF-03 | Seguridad | El sistema debe implementar autenticación JWT y control de acceso por roles institucionales. | Usuarios acceden solo a funciones autorizadas. |
| RNF-04 | Mantenibilidad | El proyecto debe mantener documentación técnica actualizada y versionada en GitHub. | README y TOC sincronizados. |
| RNF-05 | Trazabilidad  | Todos los cambios deben registrarse mediante commits descriptivos usando Conventional Commits. | Historial Git verificable. |
| RNF-06 | Escalabilidad  | El sistema debe soportar múltiples procesos de generación de horarios concurrentes. | Pruebas concurrentes exitosas. |
| RNF-07 | Compatibilidad | La interfaz debe ser responsive para escritorio y dispositivos móviles. | Validación responsive aprobada. |
| RNF-08 | Accesibilidad | La interfaz debe cumplir criterios básicos WCAG 2.1 AA. | Navegación accesible validada. |
| RNF-09 | Calidad | El proyecto debe incluir pruebas unitarias para módulos críticos. | Cobertura mínima ≥ 70%. |
| RNF-10 | Disponibilidad | El sistema debe mantener disponibilidad durante horario académico institucional. | Monitoreo operativo validado. |

**Indicadores Clave de Éxito (KPIs)**

| KPI | Objetivo |
| ----- | ----- |
| Reducción de conflictos de horarios | ≥ 70% |
| Tiempo de generación de horarios | ≤ 50 segundos |
| Uso eficiente de aulas | ≥ 85% ocupación |
| Reducción de horas muertas | ≥ 60% |
| Satisfacción estudiantil | ≥ 80% |
| Horarios válidos generados | ≥ 95% |

## 

## **PRODUCT BACKLOG**

| ID | Épica | Nombre | Descripción (User Story) | Criterios de Aceptación (Gherkin) | Pts |
| ----- | ----- | ----- | ----- | ----- | :---: |
| HU01 | Gestión | CRUD estudiantes | Como admin quiero registrar estudiantes para gestionar matrículas académicas | Dado datos válidos → se guarda; Dado email duplicado → rechaza | 3 |
| HU02 | Gestión | CRUD docentes | Como admin quiero registrar docentes con disponibilidad horaria | Dado datos válidos → se guarda; Dato incompleto → error | 3 |
| HU03 | Gestión | CRUD cursos | Como admin quiero registrar cursos con créditos y prerrequisitos | Dato válido → guarda; Código duplicado → rechaza | 3 |
| HU04 | Gestión | CRUD aulas | Como admin quiero registrar aulas según capacidad y tipo | Dato válido → guarda; Capacidad inválida → rechaza | 2 |
| HU05 | Matrícula | Validar prerrequisitos | Como sistema quiero validar prerrequisitos automáticamente | Curso sin requisitos cumplidos → rechaza matrícula | 5 |
| HU06 | Matrícula | Validar créditos | Como sistema quiero validar límite máximo de créditos | Créditos \> límite → rechaza; Créditos válidos → aprueba | 3 |
| HU07 | Horarios | Definir restricciones académicas | Como coordinador académico quiero definir restricciones institucionales para generar horarios válidos y sin conflictos. | Datos válidos → generación correcta.  | 8 |
| HU08 | Horarios | Generar horarios | Como administrador quiero generar horarios automáticamente para reducir conflictos académicos y operativos. | Conflictos detectados → generación bloqueada. | 5 |
| HU09 | Horarios | Evaluar calidad del horario | Como sistema quiero minimizar horas muertas y mejorar la distribución académica para generar horarios eficientes. | Horarios compactos generados automáticamente. | 5 |
| HU10 | Visualización | Visualizar horarios | Como usuario quiero visualizar mi horario semanal para consultar mis clases organizadamente. | Usuario autenticado → visualiza horario correctamente | 3 |
| HU11 | Visualización | Exportar horarios | Como usuario quiero exportar mi horario en PDF para descargarlo y compartirlo fácilmente. | Horario disponible → descarga correctamente | 3 |
| HU12 | Seguridad | Autenticación de usuarios | Como usuario quiero iniciar sesión en el sistema para acceder únicamente a las funcionalidades autorizadas según mi rol institucional. | Dadas credenciales válidas → acceso autorizado; Dadas credenciales inválidas → acceso denegado con mensaje de error. | 5 |
| HU13 | Seguridad | Control de acceso por roles | Como sistema quiero controlar accesos según roles institucionales para proteger funcionalidades restringidas. | Dado un rol autorizado → acceso permitido; Dado un rol no autorizado → acceso denegado automáticamente. | 5 |
| HU14 | Optimización | Optimizar generación y carga de horarios | Como usuario quiero visualizar horarios generados rápidamente para consultar información académica sin demoras ni interrupciones. | Horarios cargan en menos de 2 segundos; Preferencias horarias aplicadas durante optimización. | 5 |
| HU15 | Calidad | Ejecutar pruebas unitarias | Como desarrollador quiero implementar pruebas unitarias para garantizar estabilidad y calidad del sistema durante el desarrollo. | Cobertura mínima ≥ 70%; Pruebas ejecutadas correctamente sin errores críticos. | 5 |
| HU16 | Seguridad | Sanitizar entradas del sistema | Como sistema quiero validar y sanitizar entradas de usuarios para prevenir vulnerabilidades como SQL Injection y XSS. | Entradas maliciosas detectadas → bloqueo automático; Datos válidos → procesamiento correcto. | 3 |

## 

## **TABLA 2: PLANIFICACIÓN DE SPRINTS**

| Sprint | Fecha Inicio | Fecha Fin | Capacidad Total | ID de Historias | Suma de Puntos |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Sprint 1 | 23/03/2026 | 10/05/2026 | 20 pts | HU01, HU02, HU03, HU04, HU07  | 17 |
| Sprint 2 | 11/05/2026 | 31/05/2026 | 20 pts | HU05, HU06, HU10, HU12 | 18 |
| Sprint 3 | 01/06/2026 | 28/06/2026 | 20 pts | HU08, HU09, HU13 | 18 |
| Sprint 4 | 29/06/2026 | 12/07/2026 | 20 pts | HU11, HU14, HU15, HU16 | 16 |

## **TABLA 3: RELEASE PLAN (VERSIONAMIENTO)**

| Versión | Objetivo | Historias Incluidas | Fecha Estimada |
| ----- | ----- | ----- | ----- |
| v0.1 \- Alpha | CRUD académico \+ autenticación básica | HU01, HU02, HU03, HU04, HU07 | Fin Sprint 1 |
| v1.0 \- MVP | Generación automática de horarios válidos | HU05, HU06, HU012, HU10 | Fin Sprint 2 |
| v1.1 \- Optimización | Optimización, exportación y calidad | HU08, HU09, HU11, HU13, HU14, HU15, HU16 | Fin Sprint 3 y Sprint 4 |

