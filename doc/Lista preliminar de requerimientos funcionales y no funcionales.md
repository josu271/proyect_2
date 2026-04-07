# <a name="_8iqzcu209s4x"></a>**Lista Preliminar de Requerimientos Funcionales y No Funcionales**
## <a name="_ti9wu5tmx1fg"></a>**Requerimientos Funcionales (RF)**

|**ID**|**Requerimiento**|**Descripción**|**Prioridad**|
| :- | :- | :- | :- |
|**RF-01**|**Gestión de cursos**|**CRUD de cursos: código, nombre, créditos, prerrequisitos (lista), docente asignado**|**Alta**|
|**RF-02**|**Gestión de docentes**|**CRUD de docentes: nombre, email, disponibilidad horaria (día/hora)**|**Alta**|
|**RF-03**|**Gestión de aulas**|**CRUD de aulas: código, capacidad, tipo (aula normal, laboratorio)**|**Alta**|
|**RF-04**|**Gestión de estudiantes**|**CRUD de estudiantes: nombre, email, programa, límite de créditos (20-22)**|**Alta**|
|**RF-05**|**Matrícula de cursos**|**Estudiante selecciona cursos para el período. Validación automática de prerrequisitos y créditos**|**Alta**|
|**RF-06**|**Generación automática de horarios**|**Sistema produce un horario válido (todas las restricciones duras satisfechas)**|**Alta**|
|**RF-07**|**Visualización de horarios**|**Vista semanal (tabla días vs horas) para estudiante, docente y aula**|**Alta**|
|**RF-08**|**Autenticación y roles**|**Login con JWT. Roles: Administrador, Coordinador, Estudiante, Docente**|**Media**|
|**RF-09**|**Exportar horario**|**Opción de exportar a PDF o imagen**|**Baja**|
## <a name="_kd9ifvsj41kf"></a>**Requerimientos No Funcionales (RNF) – Basados en ISO/IEC 25010**

|**ID**|**Categoría**|**Requerimiento**|**Métrica**|
| :- | :- | :- | :- |
|**RNF-01**|**Rendimiento**|**El algoritmo de generación de horarios debe ejecutarse en menos de 30 segundos para 30 cursos, 20 docentes**|**Tiempo < 30s**|
|**RNF-02**|**Escalabilidad**|**La API debe soportar al menos 50 peticiones concurrentes sin degradación > 20%**|**Prueba de carga con k6**|
|**RNF-03**|**Usabilidad**|**La interfaz debe cumplir WCAG 2.1 nivel AA**|**Evaluación con Lighthouse (score > 90)**|
|**RNF-04**|**Seguridad**|**Cumplir OWASP Top 10 (autenticación JWT, prevención SQL injection, XSS)**|**Escaneo con OWASP ZAP sin hallazgos críticos**|
|**RNF-06**|**Disponibilidad**|**El sistema debe estar disponible 90% del tiempo en horario de evaluación**|**Monitoreo simple**|
|**RNF-07**|**Eficiencia energética (Green Software)**|**Optimizar consultas SQL y evitar procesamiento innecesario**|**Consultas < 50ms, CPU idle > 80%**|
##
### <a name="_xtxfp1kjfd5x"></a><a name="_5r9e6dm4j0a7"></a>**TABLA 1: PRODUCT BACKLOG DETALLADO**

|Prioridad|ID|Épica Relacionada|Nombre (Alias)|Descripción (User Story)|Criterios de Aceptación (Gherkin)|Puntos (Fibonacci)|
| :- | :- | :- | :- | :- | :- | :- |
|1|HU01|Gestión Académica|Registrar estudiantes|Como administrador quiero registrar estudiantes para gestionar matrícula|<p>1\. Dado un formulario válido cuando registro estudiante entonces se guarda correctamente</p><p>2\. Dado un ID duplicado cuando registro entonces el sistema rechaza</p>|3|
|2|HU02|Gestión Académica|Registrar docentes|Como administrador quiero registrar docentes para asignarlos a cursos|<p>1\. Dado datos válidos cuando registro docente entonces se almacena correctamente</p><p>2\. Dado datos incompletos cuando registro entonces se muestra error</p>|3|
|3|HU03|Gestión Académica|Registrar cursos|Como administrador quiero registrar cursos para ofertarlos en el sistema|<p>1\. Dado curso válido cuando registro entonces se guarda</p><p>2\. Dado curso duplicado cuando registro entonces se rechaza</p>|3|
|4|HU04|Gestión Académica|Registrar aulas|Como administrador quiero registrar aulas para asignar espacios físicos|<p>1\. Dado aula válida cuando registro entonces se almacena</p><p>2\. Dado capacidad inválida cuando registro entonces se rechaza</p>|2|
|5|HU05|Matrícula|Validar prerrequisitos|Como sistema quiero validar prerrequisitos para asegurar consistencia académica|<p>1\. Dado curso con prerrequisitos cuando valida entonces verifica cumplimiento</p><p>2\. Dado incumplimiento cuando valida entonces rechaza matrícula</p>|5|
|6|HU06|Matrícula|Validar créditos|Como sistema quiero validar límite de créditos para evitar sobrecarga|<p>1\. Dado créditos > límite cuando valida entonces rechaza</p><p>2\. Dado créditos válidos cuando valida entonces aprueba</p>|3|
|7|HU07|Gestión de Validación de Horarios|Definir restricciones|Como administrador quiero definir restricciones para controlar generación de horarios|<p>1\. Dado restricciones válidas cuando guardo entonces quedan registradas</p><p>2\. Dado conflicto lógico cuando guardo entonces se rechaza</p>|5|
|8|HU08|Gestión de Validación de Horarios|Generar horarios|Como administrador quiero generar horarios automáticamente para optimizar recursos|<p>1\. Dado datos válidos cuando genero entonces no hay conflictos</p><p>2\. Dado falta de recursos cuando genero entonces se notifica error</p>|8|
|9|HU09|Gestión de Validación de Horarios|Evaluar horario|Como sistema quiero evaluar calidad del horario para medir optimalidad|<p>1\. Dado horario generado cuando evalúo entonces devuelve puntaje</p><p>2\. Dado criterios definidos cuando evalúo entonces calcula correctamente</p>|5|
|10|HU10|Visualización|Ver horarios|Como usuario quiero visualizar horarios para consultar mis clases|<p>1\. Dado usuario autenticado cuando consulta entonces ve su horario</p><p>2\. Dado sin datos cuando consulta entonces muestra mensaje vacío</p>|3|
|11|HU11|Visualización|Exportar horarios|Como usuario quiero exportar horarios para uso externo|<p>1\. Dado horario disponible cuando exporto entonces descarga archivo</p><p>2\. Dado error de generación cuando exporto entonces muestra mensaje</p>|3|
|12|HU12|Seguridad|Autenticación usuarios|Como usuario quiero iniciar sesión para acceder al sistema|<p>1\. Dado credenciales válidas cuando inicio sesión entonces accedo</p><p>2\. Dado credenciales inválidas cuando intentó entonces se rechaza</p>|5|
|13|HU13|Seguridad|Autorización roles|Como sistema quiero controlar accesos por rol para proteger información|<p>1\. Dado rol definido cuando accede entonces permite acciones autorizadas</p><p>2\. Dado rol restringido cuando accede entonces deniega acceso</p>|5|
|14|HU14|Rendimiento y Mantenibilidad|Optimizar consultas|Como sistema quiero optimizar consultas para reducir latencia |<p>1\. Dado consulta cuando ejecuto entonces responde <1s</p><p>2\. Dado alta carga cuando ejecuto entonces mantiene rendimiento</p>|8|
|15|HU15|Rendimiento y Mantenibilidad|Pruebas unitarias|Como desarrollador quiero pruebas unitarias para asegurar calidad|<p>1\. Dado código nuevo cuando pruebo entonces cobertura ≥80%</p><p>2\. Dado fallo cuando pruebo entonces detecta errores</p>|5|
### <a name="_11bx84x4yvi8"></a>TABLA 2: PLANIFICACIÓN DE SPRINTS

|Sprint|Fecha Inicio|Fecha Fin|Capacidad Total|ID de Historias Incluidas|Suma de Puntos|
| :- | :- | :- | :- | :- | :- |
|Sprint 1|||25 pts|HU01, HU02, HU03, HU04, HU05, HU06, HU10|21|
|Sprint 2|||25 pts|HU07, HU08,HU12, HU13|23|
|Sprint 3|||25 pts|<p>` `HU09, HU11, HU14, HU15</p><p></p>|21|
### <a name="_fro3ysgbnbzu"></a>TABLA 3: RELEASE PLAN (VERSIONAMIENTO)

|Versión|Objetivo de la Entrega|Historias Incluidas|
| :- | :- | :- |
|v1.0 (MVP)|Gestión básica + generación inicial de horarios|HU01, HU02, HU03, HU04, HU05, HU06, HU08, HU10, HU12|
|v1.1|Optimización avanzada, seguridad y calidad|HU07, HU09, HU11, HU13, HU14, HU15|
