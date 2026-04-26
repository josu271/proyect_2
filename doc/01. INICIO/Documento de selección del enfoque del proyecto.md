# **Documento de Selección del Enfoque del Proyecto**

## **1\. Metodología: Scrum**

Decisión: Scrum con Sprints de 4 semanas (4 Sprints en total, duración total 16 semanas).

Justificación (metodológica y contextual):

* El problema tiene requisitos cambiantes (consigna PFA sección 1.a).  
* La rúbrica evalúa trabajo colaborativo y ceremonias Scrum.  
* Permite retroalimentación del docente (Product Owner) cada 2 semanas.  
* El equipo está compuesto por 4 integrantes (tamaño adecuado para Scrum).  
* El horizonte de 16 semanas se divide naturalmente en 4 Sprints (Sprint 0: análisis, Sprints 1-3: desarrollo, Sprint 4: pruebas y entrega).

## **2\. Control de versiones: Git Flow**

Decisión: Git Flow con ramas `main`, `develop`, `feature/*`, `release/*`.

Justificación:

* `main` siempre estable para entregas formales (cumple ISO/IEC 25010 \- mantenibilidad).  
* `feature/*` para desarrollo paralelo (Frontend, Backend, Motor CSP).  
* Pull Requests

## **3\. Alineación con estándares obligatorios**

| Estándar | Cómo se cumple en el stack seleccionado |
| :---- | :---- |
| W3C | React genera HTML semántico \+ validación con ESLint JSX |
| ISO/IEC 25010 | Ver sección 5 del PFA: rendimiento (FastAPI async), mantenibilidad (tipado Python), usabilidad (Tailwind \+ WCAG) |
| OWASP Top 10 | JWT con expiración, validación de entrada Pydantic, parametrización SQL (SQLAlchemy) |
| WCAG 2.1 | Tailwind \+ ARIA labels \+ contraste verificable |
| Green Software | Algoritmo CSP eficiente (OR-Tools minimiza cómputo); backend stateless reduce consumo |

## **4\. Stack tecnológico**

| Capa | Tecnología | Versión | Justificación |
| ----- | ----- | ----- | ----- |
| Frontend | React \+ Vite | React 18, Vite 5 | Build rápido, componentización, ecosistema maduro |
| Estilos | Tailwind CSS | 3.x | Acelera UI responsiva, cumple WCAG con paleta adecuada |
| Cliente HTTP | Axios | 1.x | Interceptores para JWT, manejo de errores estándar |
| Backend API | FastAPI (Python) | 0.115+ | Clave: Librerías CSP maduras en Python (OR-Tools, python-constraint). Documentación Swagger automática. Pruebas con pytest. |
| Autenticación | JWT | PyJWT | Stateless, compatible con REST, cumple OWASP |
| Motor de optimización | OR-Tools (Google) | 9.x | Algoritmo de satisfacción de restricciones probado en problemas de horarios. |
| Base de Datos | PostgreSQL | 15+ | Integridad referencial para prerrequisitos, soporte ACID, cumple restricciones de datos definidas |
| Pruebas unitarias | Vitest (FE) \+ pytest (BE) | \- | Permite cobertura ≥70% exigida en rúbrica |

## **5\. Alternativas descartadas**

| Componente | Alternativa | Razón de descarte |
| ----- | ----- | ----- |
| Backend | Node.js \+ Express | Librerías CSP inmaduras o inexistentes en JavaScript; obligaría a llamar a un microservicio externo en Python |
| Frontend | Angular | Curva de aprendizaje más alta para 16 semanas; sobreingeniería para PMV |
| BD | MongoDB | Sin integridad referencial para prerrequisitos (viola restricciones de datos definidas) |
| Estado | Redux | Overkill para PMV; Context API suficiente; se migraría solo si el sistema escala en Sprints futuros |
| Motor CSP | Algoritmo custom en Python | OR-Tools está probado, documentado y es más eficiente que una implementación casera |

## **6\. Matriz de decisión**

| Criterio (peso) | React+ FastAPI+PG | React+Node+ Mongo | Angular+Spring+ MySQL |
| :---- | ----- | ----- | ----- |
| Soporte CSP (5) | **5 (Python)** | **2** | **3** |
| Curva aprendizaje (3) | **4** | **4** | **2** |
| Estándares (4) | **5** | **3** | **5** |
| Integración (4) | **5** | **4** | **3** |
| Total ponderado | **4.63** | **3.25** | **3.38** |

**Conclusión:** El stack seleccionado es el único que cumple con el requisito obligatorio de modelado CSP con librerías maduras (OR-Tools en Python), además de alinearse con los estándares exigidos por el profesor (ISO/IEC 25010, OWASP, WCAG).