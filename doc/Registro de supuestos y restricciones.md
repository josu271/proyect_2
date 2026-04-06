# **Registro de Supuestos y Restricciones**

## **Supuestos (Asunciones)**

| ID | Supuesto | Justificación | Impacto si es falso |
| :---- | :---- | :---- | :---- |
| S-01 | Los datos de entrada (cursos, docentes, aulas) serán proporcionados en formato CSV/JSON al inicio del Sprint 2 | Para enfocar desarrollo en algoritmo, no en UI de carga masiva | Habilitar formularios manuales de ingreso |
| S-02 | La disponibilidad horaria de docentes se ingresa como bloques de 1 hora (lunes 8-9, etc.) | Simplifica el modelo CSP | Requerir manejo de fracciones de hora |
| S-03 | Los estudiantes se matriculan en un grupo único por curso (no hay múltiples secciones) | Reduce complejidad del problema | Extender modelo para manejar secciones |
| S-04 | El límite de créditos es homogéneo para todos los estudiantes: 20-22 créditos | Según consigna PFA | Hacer configurable por programa académico |
| S-05 | El aula solo tiene restricción de capacidad (no tipo especializado como laboratorio) | Simplificación inicial | Agregar atributo tipo\_aula en siguiente iteración |
| S-06 | El equipo tiene acceso a GitHub sin restricciones y a servicios cloud (Railway/Heroku/Vercel) para despliegue | Necesario para evidenciar trabajo colaborativo | Usar servidor local con ngrok o similar |

## **Restricciones (Constraints)**

| ID | Restricción | Tipo | Mitigación |
| :---- | :---- | :---- | :---- |
| R-01 | Plazo de 12 semanas para entregar PMV | Temporal (Calendario) | Planificación en Sprints de 2 semanas |
| R-02 | Capacidad computacional limitada (sin GPU, ≤ 4GB RAM para algoritmo) | Técnica | Implementar poda temprana en CSP y limitar profundidad de búsqueda |
| R-03 | Uso obligatorio de arquitectura SPA \+ API REST | Técnica | Seguir estrictamente la separación Frontend/Backend |
| R-04 | Cumplir con OWASP Top 10 (seguridad) | Seguridad | Implementar JWT, validación de inputs, prepared statements (SQL) |
| R-05 | Cumplir con WCAG 2.1 nivel AA (accesibilidad) | Social / Legal | Usar etiquetas semánticas HTML, contraste de colores, navegación por teclado |
| R-06 | Eficiencia energética (Green Software) | Ambiental | Optimizar consultas SQL, evitar procesamiento innecesario en backend |
| R-07 | Protección de datos personales | Seguridad | No almacenar contraseñas en texto plano (hash bcrypt), minimizar datos recolectados |
| R-08 | El modelo debe ser CSP u optimización combinatoria | Metodológica | Documentar formalmente el modelo matemático |

