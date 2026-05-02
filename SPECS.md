# SPECS.md

# Project Overview

Build an intelligent academic scheduling system for flexible curricula.

Stack:

- PostgreSQL (database)
- FastAPI (Python backend)
- React (frontend)
- OR-Tools (CSP solver)

Core technology:

- Constraint Satisfaction Problem (CSP)
- Backtracking + forward checking + MRV heuristic

---

# Functional Requirements

## Visitor (Unauthenticated)

As a visitor I want:

- Nothing (system requires authentication)

---

## Student (Authenticated)

As a student I want:

- Select courses to enroll
- Validate prerequisites automatically (grade ≥ 11.00/20)
- Validate credit limit (max 6 credits per semester)
- View my generated schedule (weekly view)
- Export my schedule to PDF

---

## Teacher (Authenticated)

As a teacher I want:

- Register my availability (MORNING/AFTERNOON)
- View my assigned schedule
- View assigned classrooms

---

## Coordinator (Authenticated)

As a coordinator I want:

- Generate schedules automatically using CSP
- Validate all hard constraints before publishing
- View schedules by student, teacher, or classroom
- Get detailed conflict reports

---

## Admin (Authenticated)

As an admin I want:

- CRUD students, teachers, courses, classrooms
- Manage users and roles
- View audit logs

---

# Features

| Feature | Status |
|---------|--------|
| Authentication (JWT, 4 roles) | Required |
| CRUD Estudiantes | Required |
| CRUD Docentes | Required |
| CRUD Cursos | Required |
| CRUD Aulas | Required |
| Validación de matrícula (prerrequisitos + créditos ≤6) | Required |
| Generación de horarios con CSP (OR-Tools) | Required |
| Vista semanal de horarios | Required |
| Reporte de conflictos | Required |
| Exportación a PDF | Desired |
| Trazabilidad (auditoría) | Desired |

---

# API

Endpoints:

POST /api/auth/login

POST /api/auth/register (admin only)

GET /api/estudiantes

POST /api/estudiantes

PUT /api/estudiantes/{id}

DELETE /api/estudiantes/{id}

POST /api/estudiantes/{id}/matricula

GET /api/estudiantes/{id}/horario

GET /api/docentes

POST /api/docentes

PUT /api/docentes/{id}/disponibilidad

GET /api/cursos

POST /api/cursos

PUT /api/cursos/{id}

DELETE /api/cursos/{id}

GET /api/aulas

POST /api/aulas

PUT /api/aulas/{id}

DELETE /api/aulas/{id}

POST /api/horarios/generar

GET /api/horarios

GET /api/horarios/conflictos

---

# Non Functional Requirements

- Schedule generation time < 50 seconds (30 courses, 20 teachers, 15 classrooms)
- JWT Authentication with 8h expiration
- Responsive UI (Tailwind CSS)
- WCAG 2.1 AA accessibility (Lighthouse > 90)
- OWASP Top 10 compliance
- Test coverage ≥ 70%
- Dockerized deployment (optional)

---

# Database

Tables:

estudiantes
docentes
cursos
aulas
horarios
auditoria

---

# UI Requirements

Use:

- Tailwind CSS

Include:

- Navbar with user role
- Dashboard by role (admin, coordinator, teacher, student)
- CRUD forms with validation
- Weekly schedule view (table days vs hours)
- PDF exporter

---

# Acceptance Criteria

The system is complete when:

- All features pass tests
- Authentication works (4 roles)
- CRUD works for all entities
- Schedule generation works in < 50 seconds
- Test coverage ≥ 70%
- Documentation complete (README with TOC, AGENTS.md, SPECS.md, CONSTITUTION.md)

---

# Future Enhancements

- Multi-objective optimization (minimize gaps, maximize preferences)
- Student availability (surveys)
- Courses with multiple blocks (theory + lab)
- Specialized classroom types
- iCalendar export
- Multiple campuses