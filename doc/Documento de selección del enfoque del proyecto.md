# **Documento de Selección del Enfoque del Proyecto**

## **1\. Enfoque Metodológico Ágil: Scrum** 

**Selección:** Scrum como marco de trabajo ágil.

**Justificación:**

* El problema presenta requisitos parcialmente definidos y cambiantes, lo que hace inviable un enfoque predictivo.  
* Scrum permite entregas incrementales a través de Sprints de 2 semanas, alineándose con el período de 12 semanas del curso.  
* La complejidad del modelo de optimización (CSP) requiere retroalimentación continua del Product Owner (docente) para ajustar prioridades entre restricciones.  
* Scrum define roles claros (Scrum Master, Product Owner, Development Team), lo que facilita la organización colaborativa exigida en la rúbrica.

## **2\. Enfoque de Control de Versiones: Git Flow**

**Selección:** Git Flow como flujo de trabajo.

**Justificación:**

* El proyecto requiere estabilidad en la rama main para presentaciones y entregas formales.  
* El uso de ramas feature/\* permite el desarrollo paralelo de componentes independientes (Frontend, Backend, Motor de optimización).  
* Las ramas release/\* facilitan la preparación de versiones etiquetadas semánticamente (v1.0.0, v1.1.0).  
* Se utilizarán Pull Requests (PR) con revisión de al menos un compañero para mantener calidad de código y evidencia de colaboración.

## **3\. Enfoque Tecnológico (Stack)**

| Capa | Tecnología | Justificación Técnica |
| ----- | ----- | ----- |
| **Frontend** | React \+ Vite | Vite ofrece tiempos de build rápidos, esenciales para iteraciones cortas. React permite componentización y su ecosistema (Context API, React Router) cubre necesidades de estado y navegación sin sobre ingeniería. |
| **Estilos** | Tailwind CSS | Acelera el desarrollo de UI responsive, alineada con criterios de usabilidad (ISO/IEC 25010). Reduce código CSS personalizado, mejorando la mantenibilidad. |
| **Comunicación Frontend-Backend** | Axios | Simplifica peticiones HTTP, manejo de interceptores para JWT y errores. Es estándar en la industria para React. |
| **Backend (API)** | FastAPI (Python) | El núcleo del problema es un CSP/optimización combinatoria. Python tiene bibliotecas maduras como python-constraint, ortools o pulp. FastAPI es asíncrono, documenta automáticamente (Swagger) y valida tipos con Pydantic. Alternativa Node.js fue descartada por menor soporte en librerías de optimización. |
| **Autenticación** | JWT | Stateless, compatible con arquitectura REST. Permite escalabilidad horizontal sin depender de sesiones en servidor. |
| **Base de Datos** | PostgreSQL | Sistema relacional robusto que garantiza integridad referencial (prerrequisitos, límite de créditos). Soporta datos estructurados complejos y es estándar ISO/IEC. |
| **Servicios de IA** | Python (scripts separados) | Para el motor de generación de horarios se implementará un servicio independiente en Python que se comunica vía HTTP con FastAPI. Permite evolucionar el algoritmo sin afectar el resto del sistema. |

## **4\. Comparación con alternativas**

| Componente | Alternativa descartada | Razón de descarte |
| ----- | ----- | ----- |
| Backend | Node.js \+ Express | Librerías de optimización (CSP) inmaduras en JavaScript. La implementación manual del algoritmo sería más propensa a errores y menos eficiente. |
| Frontend | Angular | Curva de aprendizaje más alta para un proyecto de 12 semanas. React permite prototipado más rápido. |
| Base de Datos | MongoDB | El problema tiene restricciones relacionales (prerrequisitos, créditos) que requieren integridad referencial. PostgreSQL es más adecuado. |

## **5\. Conclusión**

El enfoque seleccionado (Scrum \+ Git Flow \+ Stack React/FastAPI/PostgreSQL) equilibra:

* **Requerimientos académicos:** Uso de estándares (W3C, OWASP, ISO/IEC 25010).  
* **Complejidad del problema:** Soporte nativo para modelado CSP en Python.  
* **Colaboración:** Git Flow y PRs evidencian trabajo en equipo.  
* **Plazo:** Herramientas que aceleran el desarrollo (Vite, Tailwind, FastAPI auto-documentado).