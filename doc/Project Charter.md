# **Project Charter** 

| Nombre del proyecto: | SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS EN ENTORNOS DE CURRÍCULO FLEXIBLE |
| :---- | :---- |

|  | Detalles del proyecto |
| :---- | :---- |
| Objetivos del proyecto: |  |
| Las universidades con currículo flexible enfrentan dificultades significativas en la planificación de horarios debido a: Alta variabilidad en la matrícula estudiantil. Múltiples restricciones interdependientes (prerrequisitos, disponibilidad de docentes, capacidad de aulas, límite de créditos). Conflictos entre disponibilidad de actores y recursos. No existe una solución única ni trivial, lo que constituye un problema complejo de ingeniería (NP-hard, similar a un CSP). Actualmente, la generación de horarios se realiza manualmente con hojas de cálculo, tomando semanas y produciendo resultados subóptimos con conflictos no resueltos. El proyecto busca “Diseñar e implementar una aplicación web inteligente que genere horarios académicos óptimos para universidades con currículo flexible, considerando restricciones académicas, operativas y contextuales”. |  |
| Alcance del proyecto: |  |
| **Componente** | **Descripción** |
| Gestión de entidades | CRUD de cursos, docentes, aulas y estudiantes |
| *Validación de matrícula* | Verificación de prerrequisitos y límite de créditos (20-22) |
| *Generación de horarios* | Algoritmo CSP que produce un horario válido |
| Visualización | Vista semanal de horarios por estudiante, docente y aula |
| *Autenticación* | Login con JWT y roles (administrador, coordinador, estudiante, docente) |
| Documentación | Carpeta `docs/` con estructura PMBOK y README completo |

| Recursos preasignados: |  |
| :---- | ----- |
| Hardware: Computadoras personales Infraestructura: Acceso a internet, plataforma GitHub Software: VS Code, Node.js, Python, PostgreSQL, Git Servicios cloud (opcional): Railway / Vercel / Render para despliegue demostrativo |  |

|  | Lista de partes interesadas |  |
| ----- | ----- | :---: |
| **Nombre** | **Título / Rol** | **Responsabilidad en el proyecto** |
| Daniel Gamarra Moreno | Evaluador / Sponsor | Supervisión, validación de entregables y evaluación final |
| Estudiantes (usuarios finales) | Usuario final (representado) | Validación de usabilidad, selección de cursos, visualización de horarios |
| Docentes (usuarios internos) | Usuario final (representado) | Registrar disponibilidad horaria |
| Sulla Corbetta Jose Luis | Desarrollador Backend | Implementación de API REST, autenticación JWT, lógica de negocio |
| Reyes Mendoza Harol Jesus | Desarrollador Frontend | Implementación de SPA React, UI/UX, consumo de API |
| Rafael Carpio Fabrizio Alezander | QA / Documentador | Pruebas, documentación técnica (docs/), seguimiento de criterios de aceptación |
| Vilcahuaman Gonzales Jordan Ricardo | Especialista en Datos | Modelado de datos, diseño de esquema PostgreSQL, definición de estructura para CSP |

|  | Cronograma de hitos |  |  |
| ----- | ----- | ----- | ----- |
| **Hito** | **Sprint** | **Fecha estimada** | **Entregable clave** |
| Inicio del proyecto | Sprint 1 | Semana 1 | Repositorio configurado, documentación Sprint 0 completa |
| Base de datos y CRUD | Sprint 1 | Semanas 2-3 | Modelo BD funcional, endpoints básicos |
| Validación y CSP base | Sprint 1 | Semanas 4-5 | Validación de matrícula, modelo CSP definido |
| Motor de generación | Sprint 2 | Semanas 6-9 | Algoritmo que genera horarios válidos (v1.0.0) |
| Frontend e integración | Sprint 2 | Semanas 9-14 | SPA conectada a API, visualización de horarios |
| Pruebas y ajustes | Sprint 3 | Semanas 14-15 | Cobertura de pruebas \>70%, ajustes de rendimiento |
| Entrega final | Sprint 3 | Semana 16 | Video demostrativo, documentación final, tag v1.0.0 |

