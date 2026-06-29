# 📚 Sistema Web de Generación Óptima de Horarios Académicos

## 📌 Tabla de Contenidos (TOC)

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Contexto del Problema](#-contexto-del-problema)
3. [Objetivos del Proyecto](#-objetivos-del-proyecto)
4. [Análisis del Negocio Académico](#-análisis-del-negocio-académico)
5. [Stakeholders Involucrados](#-stakeholders-involucrados)
6. [Indicadores Clave de Éxito (KPIs)](#-indicadores-clave-de-éxito-kpis)
7. [Funcionalidades Principales](#-funcionalidades-principales)
8. [Arquitectura del Sistema](#-arquitectura-del-sistema)
9. [Estructura del Proyecto](#-estructura-del-proyecto)
10. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
11. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
12. [Variables de Entorno](#-variables-de-entorno)
13. [Ejecución de Pruebas](#-ejecución-de-pruebas)
14. [Estándares y Buenas Prácticas Aplicadas](#-estándares-y-buenas-prácticas-aplicadas)
15. [Metodología de Desarrollo](#-metodología-de-desarrollo)
16. [Equipo de Desarrollo](#-equipo-de-desarrollo)
17. [Licencia](#-licencia)
---

## 🧠 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un sistema web inteligente orientado a la generación óptima de horarios académicos universitarios, considerando restricciones académicas, disponibilidad docente, asignación de aulas y optimización de recursos institucionales.

El sistema busca reducir conflictos de horarios, minimizar tiempos muertos y mejorar la planificación académica mediante técnicas de optimización combinatoria y CSP (Constraint Satisfaction Problem).

---

## 🌎 Contexto del Problema

La planificación de horarios académicos representa un problema complejo debido a la gran cantidad de variables y restricciones involucradas en la asignación de cursos, docentes, aulas y franjas horarias.

Actualmente, gran parte del proceso se realiza manualmente o mediante herramientas limitadas, ocasionando:

- Cruces de horarios
- Horarios fragmentados
- Baja disponibilidad de vacantes
- Mala distribución de carga académica
- Sobrecarga docente
- Uso ineficiente de aulas

El problema pertenece al proceso institucional de Gestión Académica y corresponde a un problema NP-Hard de alta complejidad computacional.

---

## 🎯 Objetivos del Proyecto

### Objetivo General

Desarrollar un sistema web capaz de generar horarios académicos óptimos automáticamente considerando restricciones institucionales y criterios de optimización.

### Objetivos Específicos

- Reducir conflictos de horarios académicos
- Optimizar la asignación de docentes y aulas
- Minimizar tiempos muertos entre clases
- Mejorar la experiencia de estudiantes y coordinadores
- Automatizar el proceso de planificación académica
- Facilitar la validación operativa de horarios

---

## 🏢 Análisis del Negocio Académico

El proceso institucional identificado incluye:

1. Cierre del periodo académico
2. Consolidación del historial académico
3. Identificación de estudiantes aprobados, desaprobados y retirados
4. Estimación de demanda potencial de cursos
5. Elaboración de oferta académica
6. Evaluación de restricciones institucionales
7. Publicación de horarios en plataforma académica
8. Proceso de matrícula estudiantil

---

## 👥 Stakeholders Involucrados

| Stakeholder | Rol |
| :--- | :--- |
| Estudiantes | Seleccionan cursos y visualizan horarios |
| Docentes | Dictan cursos según disponibilidad y carga académica |
| Coordinadores Académicos | Supervisan planificación académica |
| Administradores | Gestionan recursos institucionales |
| Sistema | Genera horarios automáticamente mediante CSP |

---

## 📈 Indicadores Clave de Éxito (KPIs)

| KPI | Objetivo |
| :--- | :--- |
| Reducción de conflictos académicos | ≥ 70% |
| Tiempo de generación de horarios | ≤ 50 segundos |
| Uso eficiente de aulas | ≥ 85% |
| Reducción de horas muertas | ≥ 60% |
| Satisfacción estudiantil | ≥ 80% |
| Horarios válidos generados | ≥ 95% |

---

## 🚀 Funcionalidades Principales

### 🔹 Gestión Académica
- Registro de estudiantes, docentes, cursos y aulas
- Gestión completa de datos mediante operaciones CRUD

### 🔹 Matrícula Estudiantil
- Validación automática de prerrequisitos (nota mínima aprobatoria: 11/20)
- Control de créditos permitidos por semestre (máximo 6 créditos)

### 🔹 Generación de Horarios
- Motor basado en CSP y optimización combinatoria
- Generación automática sin conflictos de recursos
- Minimización de horas muertas entre clases

### 🔹 Visualización
- Vista semanal de horarios por rol (estudiante, docente, administrador)
- Filtros por estudiante, docente, aula y ciclo

### 🔹 Seguridad
- Autenticación JWT con expiración de 8 horas
- Control de acceso basado en roles (administrador, docente, estudiante, coordinador)

---

## 🏛 Arquitectura del Sistema

El sistema sigue una arquitectura de tres capas con separación clara de responsabilidades:

- **Frontend SPA** — Aplicación React con enrutamiento del lado del cliente, organizada por módulos según el rol del usuario (admin, docente, estudiante).
- **Backend API REST** — FastAPI con patrón Service Layer, endpoints asíncronos y validación de entrada mediante Pydantic.
- **Base de datos relacional** — PostgreSQL gestionado mediante SQLAlchemy ORM con migraciones Alembic.
- **Autenticación** — JWT gestionado en el backend; el frontend almacena el token y lo adjunta en cada petición.

La comunicación entre frontend y backend se realiza a través de HTTP/REST. El CORS está configurado para aceptar únicamente peticiones desde `localhost:5173` en desarrollo.

---

## 📁 Estructura del Proyecto

```
proyect_2/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuración, seguridad y dependencias
│   │   ├── middleware/        # Métricas y middlewares personalizados
│   │   └── modules/
│   │       ├── admin/         # Gestión de aulas, cursos, docentes, estudiantes y secciones
│   │       ├── auth/          # Autenticación y tokens JWT
│   │       ├── docente/       # Disponibilidad, horario y cursos del docente
│   │       ├── estudiante/    # Matrícula, historial, horario y cursos del estudiante
│   │       └── environmental/ # Métricas ambientales
│   ├── requirements.txt
│   └── .env
├── doc/
│   ├── 01. INICIO/
│   ├── 02. PLANIFICACION/                 
│   ├── 03. IMPLEMENTACION/
│   ├── 04. REVISION Y RETROSPECTIVA/ 
│   ├── 05. LANZAMIENTO/                
│   ├── 06. CIERRE/                 
│   ├── TESTING/
│   └── Pruebas de Calidad
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas organizadas por rol
│   │   ├── routes/            # Definición de rutas
│   │   └── context/           # Estado global con Context API
│   ├── test/                  # Pruebas unitarias, de integración y E2E
│   ├── package.json
│   └── vite.config.js
├── README.md
├── SPECS.md
├── CONSTITUTION.md
└── Agents.md
```

---

## ⚙ Tecnologías Utilizadas  

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React + Vite |
| Estilos | Tailwind CSS |
| Backend | FastAPI (Python) |
| ORM | SQLAlchemy + Alembic |
| Base de datos | PostgreSQL |
| Autenticación | JWT (PyJWT + bcrypt) |
| Pruebas Backend | pytest + pytest-cov |
| Pruebas Frontend | Vitest + Cypress |
| Control de versiones | Git + GitHub |

---

## 🔧 Instalación y Puesta en Marcha

### Requisitos previos

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/<usuario>/proyect_2.git
cd proyect_2
```

### 2. Configurar el Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección Variables de Entorno)

# Ejecutar migraciones
alembic upgrade head

# Iniciar el servidor de desarrollo
uvicorn app.main:app --reload
```

El backend estará disponible en `http://localhost:8000`.  
La documentación interactiva de la API (Swagger) se encuentra en `http://localhost:8000/docs`.

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## 🔑 Variables de Entorno

Copia el archivo `.env.example` ubicado en `backend/` y renómbralo como `.env`. Las variables requeridas son:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `matricula` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tu_password` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `clave_segura_aleatoria` |
| `JWT_ALGORITHM` | Algoritmo de firma JWT | `HS256` |
| `JWT_EXPIRE_HOURS` | Duración del token en horas | `8` |

> ⚠️ **Nunca** incluyas el archivo `.env` en el repositorio. Está excluido por `.gitignore`.

---

## 🧪 Ejecución de Pruebas

### Backend (pytest)

```bash
cd backend
source venv/bin/activate

# Ejecutar todas las pruebas
pytest

# Con reporte de cobertura
pytest --cov=app --cov-report=term-missing
```

### Frontend — Pruebas unitarias y de integración (Vitest)

```bash
cd frontend

# Ejecutar pruebas
npm run test

# Con reporte de cobertura
npm run test:cobertura

# Modo TDD (watch)
npm run test:tdd
```

### Frontend — Pruebas E2E (Cypress)

```bash
cd frontend

# Modo interactivo
npm run test:cypress:open

# Modo headless (CI)
npm run test:cypress:run
```

> **Objetivo de cobertura:** Total ≥ 70% · Módulo de validación ≥ 80%

---

## 🔐 Estándares y Buenas Prácticas Aplicadas

| Estándar | Aplicación |
| :--- | :--- |
| ISO/IEC 25010 | Calidad del software |
| OWASP Top 10 | Seguridad |
| WCAG 2.1 AA | Accesibilidad |
| Git Flow | Control de versiones |
| Scrum | Gestión ágil |
| TDD | Calidad y testing |

---

## 🔄 Metodología de Desarrollo

El proyecto utiliza:

- **Scrum** — Desarrollo iterativo con sprints cortos
- **Git Flow** — Ramas `main`, `develop`, `feature/*` y `release/*`
- **TDD** — Ciclo Red → Green → Refactor
- **Conventional Commits** — Mensajes de commit estandarizados (`feat:`, `fix:`, `docs:`, etc.)
- **Desarrollo incremental** basado en MVP

---

## 👥 Equipo de Desarrollo

| Nombre | Rol |
| :--- | :--- |
| Sulla Corbetta Jose Luis | Backend Developer |
| Reyes Mendoza Harol Jesus | Frontend Developer |
| Rafael Carpio Fabrizio Alezander | QA / Documentación |
| Vilcahuaman Gonzales Jordan Ricardo | Especialista en Datos |

---

## 📄 Licencia

Proyecto desarrollado con fines académicos para el curso **Taller de Proyectos 2** – Ingeniería de Sistemas e Informática.
