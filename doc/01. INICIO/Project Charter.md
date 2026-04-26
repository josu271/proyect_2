# **Project Charter** 

| Nombre del proyecto: | SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS EN ENTORNOS DE CURRÍCULO FLEXIBLE |
| :---- | :---- |

|  | Detalles del proyecto |
| :---- | :---- |
| Problema base |  |
| Universidades con currículo flexible generan horarios manualmente con hojas de cálculo, tardando semanas y produciendo conflictos: Solapamientos de horarios (estudiante, docente, aula) Prerrequisitos incumplidos Límite de créditos no respetado (máximo 6 créditos por semestre) Disponibilidad docente ignorada Aulas subutilizadas o sobresaturadas El problema es NP-hard, clasificable como CSP (Constraint Satisfaction Problem). |  |
| Objetivo general |  |
| Diseñar e implementar una aplicación web inteligente que genere horarios académicos óptimos, considerando restricciones académicas, operativas y contextuales. |  |
| Entregable clave |  |
| PMV funcional (v1.0.0) con generación automática de horarios válidos en ≤ 50 segundos para escenario de prueba (200 estudiantes, 10 cursos, 10 docentes). |  |
| Alcance del proyecto |  |
| Gestión de entidades (CRUD). Cursos, docentes, aulas, estudiantes. Validación de matrícula. Prerrequisitos \+ límite de créditos (máx. 6). Generación de horarios. CSP (backtracking \+ forward checking). Optimización multiobjetivo (minimizar huecos). Visualización. Vista semanal (L-V, 7-21h) por rol. Exportación a PDF/ICS. Autenticación. JWT con 4 roles (admin, coordinador, docente, estudiante). Despliegue. Opcional (Railway/Vercel/Render). Producción real. |  |

| Recursos preasignados: |  |
| :---- | ----- |
| Hardware: Computadoras personales Infraestructura: Acceso a internet, plataforma GitHub Software: VS Code, Node.js, Python, PostgreSQL, Git Servicios cloud (opcional): Railway / Vercel / Render para despliegue demostrativo |  |

|  | Lista de partes interesadas |  |  |
| ----- | :---- | :---: | :---: |
| **Nombre** |  | **Título / Rol** | **Responsabilidad en el proyecto** |
| Daniel Gamarra Moreno |  | Evaluador / Sponsor | Supervisión, validación de entregables, evaluación final. |
| Estudiantes (usuarios finales) |  | Usuario final (representado) | Validación de usabilidad, selección de cursos, visualización de horarios. |
| Docentes (usuarios internos) |  | Usuario final (representado) | Registrar disponibilidad horaria |
| Sulla Corbetta Jose Luis |  | Desarrollador Backend | API REST (FastAPI), autenticación JWT, lógica de negocio. |
| Reyes Mendoza Harol Jesus |  | Desarrollador Frontend | SPA (React), UI/UX, consumo de API |
| Rafael Carpio Fabrizio Alezander |  | QA / Documentador | Pruebas, documentación técnica (docs/), criterios de aceptación |
| Vilcahuaman Gonzales Jordan Ricardo |  | Especialista en Datos | Modelado de datos, esquema PostgreSQL, estructura para CSP |

|  | Cronograma de hitos |  |  |
| ----- | ----- | ----- | ----- |
| **Hito** | **Sprint** | **Fecha estimada** | **Entregable clave** |
| Inicio del proyecto | Sprint 0 | Semana 1 | Repositorio configurado, documentación Sprint 0 completa |
| Base de datos \+ CRUD \+ validación | Sprint 1 | Semanas 2-5 | Modelo BD funcional, endpoints básicos, validación de matrícula (prerrequisitos \+ créditos) |
| Motor CSP \+ generación | Sprint 2 | Semanas 6-10 | Algoritmo CSP (backtracking \+ forward checking) que genera horarios válidos (v1.0.0) |
| Frontend \+ integración | Sprint 3 | Semanas 11-14 | SPA conectada a API, visualización de horarios por rol, autenticación JWT |
| Pruebas \+ ajustes \+ entrega final | Sprint 4 | Semanas 15-16 | Cobertura de pruebas ≥70%, video demostrativo, documentación final, tag v1.0.0 |

