# Mapa de pruebas en la carpeta test

## Como quedo organizado

Todo el testing del frontend ahora vive dentro de `frontend/test`.

- `frontend/test/Aceptacion`
- `frontend/test/E2E`
- `frontend/test/TDD`
- `frontend/test/Cobertura`
- `frontend/test/support`

Cada tipo de prueba tiene sus carpetas por modulo trabajado para que la estructura se lea rapido y no se vea automatica o desordenada.

## Que pide el PDF y donde esta

### 1.4 Pruebas de Aceptacion

#### Inicio de sesion

- Archivo: `frontend/test/Aceptacion/autenticacion/login.cy.js`
- Que hace:
  valida login exitoso, error por credenciales invalidas y acceso a recuperar password.

#### Gestion de datos

- Archivo: `frontend/test/Aceptacion/administracion/secciones-nrc.cy.js`
- Que hace:
  valida crear secciones, bloquear edicion de una seccion con horario y cancelar una seccion.

#### Navegacion funcional

- Archivo: `frontend/test/Aceptacion/navegacion/navegacion-por-roles.cy.js`
- Que hace:
  recorre vistas principales de `admin`, `docente` y `estudiante`, incluyendo cierre de sesion.

#### Validaciones funcionales

- Archivo: `frontend/test/Aceptacion/estudiante/matricula-validaciones.cy.js`
- Que hace:
  valida reglas de matricula como cruce horario, falta de cupos, exceso de creditos y confirmacion exitosa.

### 1.5 Pruebas E2E

#### Golden path / happy path

- Archivo: `frontend/test/E2E/multiusuario/flujo-academico-multiusuario.cy.js`
- Que hace:
  une el flujo completo `admin -> docente -> estudiante` usando la misma informacion academica.

#### Unhappy path / recuperacion

- Archivo: `frontend/test/E2E/estudiante/errores-y-recuperacion.cy.js`
- Que hace:
  simula un login fallido, un error del servidor al confirmar matricula y la recuperacion posterior del flujo.

### TDD que ya existia y ahora quedo ordenado

#### API de autenticacion

- Archivo: `frontend/test/TDD/autenticacion/auth-api.test.mjs`
- Que hace:
  valida que el login mande bien `correo` y `contrasena` y que `apiRequest` muestre el error real del backend.

#### Pantallas de autenticacion

- Archivo: `frontend/test/TDD/autenticacion/auth-pages.test.mjs`
- Que hace:
  valida la estructura basica de `login` y `recuperar password`.

## Carpeta de cobertura

Se agrego `frontend/test/Cobertura` con subcarpetas por modulo para guardar luego reportes o notas de cobertura sin mezclarlo con los specs.

## Scripts utiles

Desde `frontend`:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
npm run test:tdd
npm run test:aceptacion
npm run test:e2e
npm run test:cobertura
```
