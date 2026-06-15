<table>
<thead>
<tr>
<th style="text-align: center;">FACTOR</th>
<th style="text-align: center;">id</th>
<th style="text-align: center;">PREGUNTA</th>
<th style="text-align: center;">ARTEFACTO</th>
<th><p><strong>SI CUMPLE</strong></p>
<p>(5)</p></th>
<th><p><strong>CUMPLE PARCIAL</strong></p>
<p>(3)</p></th>
<th><p><strong>NO CUMPLE</strong></p>
<p><strong>(1)</strong></p></th>
<th><strong>ACCION CORRECTIVA O EVIDENCIA</strong></th>
<th>RESPONSABLE</th>
<th style="text-align: center;">FECHA</th>
<th><p>PO</p>
<p>puntaje obtenido</p></th>
<th><p>PD</p>
<p>puntaje deseado</p></th>
<th><p>Nivel Apego</p>
<p>= (PO/PD)*100</p></th>
<th><p>NIVEL</p>
<p>APEGO POR</p>
<p>FACTOR</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 3%" />
<col style="width: 22%" />
<col style="width: 7%" />
<col style="width: 2%" />
<col style="width: 3%" />
<col style="width: 3%" />
<col style="width: 22%" />
<col style="width: 7%" />
<col style="width: 6%" />
<col style="width: 3%" />
<col style="width: 4%" />
<col style="width: 4%" />
<col style="width: 5%" />
</colgroup>
<thead>
<tr>
<th rowspan="10" style="text-align: center;"><strong>OWASP</strong></th>
<th style="text-align: center;"><strong>01</strong></th>
<th>¿Se tiene implementado el <strong>A01:2021 - Pérdida de Control de Acceso</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th></th>
<th style="text-align: center;">X</th>
<th><p>Rutas /admin/cursos, /admin/docentes, /admin/estudiantes no tienen Depends(get_current_user). <strong>Cualquier usuario sin autenticar puede leer, crear, actualizar y eliminar datos.</strong></p>
<p><strong>Agregar dependencia de autorización con verificación de rol en cada router admin.</strong></p></th>
<th style="text-align: center;">Jose Sulla</th>
<th style="text-align: center;">Semana 14</th>
<th style="text-align: center;">1</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">20</th>
<th style="text-align: center;"><strong>22</strong></th>
</tr>
<tr>
<th style="text-align: center;"><strong>02</strong></th>
<th>¿Se tiene implementado el <strong>A02:2021 - Fallas Criptográficas</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th></th>
<th style="text-align: center;">X</th>
<th><p>JWT_SECRET='sulla123' expuesto en .env commiteado al repositorio. No se fuerza HTTPS. Contraseñas con pgcrypto crypt() son correctas pero la clave JWT es trivial.</p>
<p><strong>Excluir .env del repositorio. Rotar JWT_SECRET por valor de alta entropía. Configurar HTTPS en producción.</strong></p></th>
<th style="text-align: center;">Jordan Vilcahuaman</th>
<th style="text-align: center;">Semana 14</th>
<th style="text-align: center;">1</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">20</th>
<th style="text-align: center;"><strong>50</strong></th>
</tr>
<tr>
<th style="text-align: center;"><strong>03</strong></th>
<th>¿Se tiene implementado el <strong>A03:2021 - Inyección</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th style="text-align: center;">X</th>
<th></th>
<th><p>Consultas parametrizadas con psycopg2 (%s) protegen contra SQL injection. Sin embargo, se observa f-string en auth_service error detail: f'Error en login: {str(e)}' que puede filtrar información de la BD.</p>
<p><strong>Eliminar detalle de excepción en respuestas HTTP. Revisar todos los f-strings en HTTPException</strong></p></th>
<th style="text-align: center;">Jose Sulla</th>
<th style="text-align: center;">Semana 14</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">60</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>04</strong></th>
<th>¿Se tiene implementado el <strong>A04:2021 - Diseño Inseguro</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th></th>
<th style="text-align: center;">X</th>
<th><p>No existe modelo de amenazas ni principio de mínimo privilegio. Rutas admin sin autenticación. El endpoint /docente/disponibilidad/{usuario_id} acepta usuario_id por path sin verificar que coincida con el token.</p>
<p><strong>Definir arquitectura de seguridad. Implementar verificación de identidad en todos los endpoints sensibles.</strong></p></th>
<th style="text-align: center;">Harol Reyes</th>
<th style="text-align: center;">Semana 15</th>
<th style="text-align: center;">1</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">20</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>05</strong></th>
<th>¿Se tiene implementado el <strong>A05:2021 - Configuración de Seguridad Incorrecta</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th></th>
<th style="text-align: center;">X</th>
<th><p>CORS permite credentials con allow_origins solo localhost (bien), pero allow_methods=['*'] y allow_headers=['*']. FastAPI en modo debug expuesto. .env con credenciales en repo.</p>
<p><strong>Restringir métodos y headers CORS. Asegurar modo producción. Gestionar secretos fuera del repositorio.</strong></p></th>
<th style="text-align: center;">Fabrizio Rafael</th>
<th style="text-align: center;">Semana 15</th>
<th style="text-align: center;">1</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">20</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>06</strong></th>
<th>¿Se tiene implementado el <strong>A06:2021 - Componentes Vulnerables y Desactualizados</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th style="text-align: center;">X</th>
<th></th>
<th><p>requirements.txt sin versiones fijadas (fastapi, psycopg2-binary, PyJWT, etc.). Dependencias de frontend tampoco versionadas en lock estable. Sin SCA automatizado.</p>
<p><strong>Fijar versiones en requirements.txt. Integrar pip-audit o Safety en CI. Revisar npm audit para frontend</strong>.</p></th>
<th style="text-align: center;">Harol Reyes</th>
<th style="text-align: center;">Semana 15</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">60</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>07</strong></th>
<th>¿Se tiene implementado el <strong>A07:2021 - Fallas de Identificación y Autenticación</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th>X</th>
<th style="text-align: center;"></th>
<th><p>Existe JWT con expiración (8h) y verificación de usuario activo. Falta: rate limiting en /auth/login, no hay bloqueo por intentos fallidos, JWT_SECRET débil ('sulla123'), sin refresh tokens.</p>
<p><strong>Agregar rate limiting, bloqueo de cuenta tras N intentos, secreto robusto y política de refresh token.</strong></p></th>
<th style="text-align: center;">Fabrizio Rafael</th>
<th style="text-align: center;">Semana 14</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">20</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>08</strong></th>
<th>¿Se tiene implementado el <strong>A08:2021 - Fallas en el Software y en la Integridad de los Datos</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th style="text-align: center;">X</th>
<th></th>
<th><p>Sin verificación de integridad de dependencias (no hash en requirements.txt). Sin pipeline CI/CD con firma de artefactos. No hay validación de entrada en todos los schemas (algunos campos sin restricciones).</p>
<p><strong>Usar pip install con hashes. Agregar validaciones Pydantic más estrictas (longitudes, formatos).</strong></p></th>
<th style="text-align: center;">Harol Reyes</th>
<th style="text-align: center;">Semana 15</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">60</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>09</strong></th>
<th>¿Se tiene implementado el <strong>A09:2021 - Fallas en el Registro y Monitoreo</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th style="text-align: center;">X</th>
<th></th>
<th><p>Solo existe EnvironmentalMetricsMiddleware que registra tiempos y bytes. No hay logging de intentos de autenticación fallidos, accesos no autorizados ni errores de seguridad.</p>
<p><strong>Implementar logging estructurado con Python logging. Registrar eventos de seguridad (login fallido, 401, 403).</strong></p></th>
<th style="text-align: center;">Jose Sulla</th>
<th style="text-align: center;">Semana 15</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">60</th>
<th></th>
</tr>
<tr>
<th style="text-align: center;"><strong>10</strong></th>
<th>¿Se tiene implementado el <strong>A10:2021 - Falsificación de Solicitudes del Lado del Servidor</strong>?</th>
<th style="text-align: center;">SOFTWARE</th>
<th></th>
<th style="text-align: center;">X</th>
<th></th>
<th><p>No se identificaron llamadas HTTP salientes en el código analizado. El riesgo es bajo en el estado actual, pero no existe validación de URLs si se agrega integración externa en el futuro.</p>
<p><strong>Documentar política de URLs permitidas. Agregar allowlist si se implementan llamadas externas.</strong></p></th>
<th style="text-align: center;">Jordan Vilcahuaman</th>
<th style="text-align: center;">Semana 14</th>
<th style="text-align: center;">3</th>
<th style="text-align: center;">5</th>
<th style="text-align: center;">60</th>
<th></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| Porciento de la evaluacion | **44** |
|----------------------------|--------|
