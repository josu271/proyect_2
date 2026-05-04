# CONSTITUTION.md

## Estructura del Proyecto

Siempre utiliza una estructura de proyecto modular y mantenible.

**Estructura raíz:**

/backend         # FastAPI (Python)
/frontend        # React + Vite
/docs            # Documentation
/tests           # Automated tests
/docker          # Docker configurations (optional)


**Siempre incluir:**

- `README.md` (con Tabla de Contenidos)
- `.gitignore`
- `.env.example`
- `CHANGELOG.md`

---

## Estrategia de Desarrollo

Utilizar desarrollo incremental (Scrum + Git Flow).

**Reglas:**

- Implementar una funcionalidad a la vez (una User Story por Pull Request)
- Validar cada funcionalidad antes de pasar a la siguiente
- Ejecutar las pruebas antes de continuar
- Nunca implementar múltiples funcionalidades mayores al mismo tiempo

---

## Estándares de Codificación

### Python (Backend - FastAPI)

**Usar:**

- `snake_case` para variables y funciones
- `PascalCase` para clases y modelos de Pydantic
- Ruff o Black para formateo
- Type hints (obligatorio)

**Seguir:**

- Principios SOLID
- Clean Code
- Convenciones RESTful API
- Patrón Service Layer
- Patrón Repository cuando sea aplicable

### JavaScript (Frontend - React)

**Usar:**

- `camelCase` para variables
- `PascalCase` para componentes de React
- ESLint
- Prettier

**Seguir:**

- Principios SOLID
- Clean Code
- Estructura de carpetas basada en funcionalidades (Feature-based)

**Evitar:**

- Class components
- Lógica de negocio dentro de componentes de UI

---

## Estándares del Backend

Utilizar:

- FastAPI
- Pydantic para validación de entrada
- SQLAlchemy ORM
- Endpoints asíncronos cuando sea posible
- Patrón Service Layer

---

## Estándares del Frontend

Utilizar:

- Componentes funcionales
- React Hooks
- Context API para manejo de estado
- Axios para peticiones HTTP
- Tailwind CSS para estilos

---

## Estrategia de Pruebas (TDD)

Utilizar **TDD (Test-Driven Development)** en todas las funcionalidades.

**Ciclo:**

1. **RED** – Escribir prueba que falla
2. **GREEN** – Implementar el código mínimo para que pase
3. **REFACTOR** – Mejorar el código sin romper las pruebas

**Herramientas de Pruebas:**

- `pytest + pytest-cov` (backend)
- `Vitest + @vitest/coverage-v8` (frontend)

**Objetivo de Cobertura:**

- Total ≥ 70%
- Módulo de validación ≥ 80%
- Módulo CSP ≥ 70%

---

## Seguridad

Seguir OWASP Top 10:

- JWT con expiración de 8 horas
- Validación de entrada usando Pydantic
- Prevención de SQL injection (SQLAlchemy)
- Hashing de contraseñas con bcrypt
- Rate limiting
- Variables de entorno para secretos
- HTTPS en producción

---

## Reglas de Git

Utilizar **Conventional Commits**:

- `feat:` nueva funcionalidad
- `fix:` corrección de errores
- `refactor:` refactorización de código
- `docs:` documentación
- `test:` pruebas
- `chore:` mantenimiento

**Estrategia de ramas (Git Flow):**

- `main` → producción (siempre estable)
- `develop` → integración
- `feature/*` → nuevas funcionalidades
- `release/*` → preparación de releases

**Pull Requests:**

- Obligatorias para `main` y `develop`
- Mínimo 1 revisor
- Todas las pruebas deben pasar
- La cobertura no debe disminuir

---

## Límites (Boundaries)

**NO modificar:**

- `requirements.txt` sin motivo justificado
- `package-lock.json` sin motivo justificado
- Valores del `.env` (usar `.env.example`)
- Migraciones generadas automáticamente salvo que sea necesario

Nunca eliminar código existente que funcione a menos que se esté reemplazando de forma segura.

---

## Requisitos de Documentación

Siempre documentar:

- Endpoints de API (FastAPI genera Swagger automáticamente)
- Esquema de base de datos (en `SPECS.md`)
- Instrucciones de instalación (en `README.md`)
- Decisiones arquitectónicas (en `CONSTITUTION.md`)

---

## Enmiendas a la Constitución

Esta constitución solo puede ser modificada mediante:

- Consenso del equipo (4/4 votos)
- Acuerdo del Product Owner (profesor)

Todas las enmiendas deben quedar documentadas en el `CHANGELOG.md`.

---

---
- Cambiar algunos términos técnicos

Solo dime y lo ajusto.
