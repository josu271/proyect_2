# 📚 Sistema de Generación Óptima de Horarios Académicos

## Tabla de Contenidos (TOC)

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Objetivo](#objetivo)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Modelado del Problema](#modelado-del-problema)
7. [Metodología de Desarrollo](#metodología-de-desarrollo)
8. [Estado del Proyecto](#estado-del-proyecto)
9. [Equipo de Desarrollo](#equipo-de-desarrollo)
10. [Licencia](#licencia)

---

## 🧠 Descripción del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web inteligente capaz de generar horarios académicos óptimos en universidades con currículo flexible.

El problema aborda la complejidad en la planificación de horarios, considerando múltiples variables y restricciones como:

- Disponibilidad de docentes
- Prerrequisitos de cursos (nota mínima ≥ 11.00/20)
- Límite de créditos por estudiante (**máximo 6 créditos por semestre**)
- Capacidad de aulas (mínimo 15, máximo 40 estudiantes)
- No solapamiento de horarios (estudiante, docente, aula)

Se trata de un problema de **alta complejidad (NP-hard)**, modelado como un **Problema de Satisfacción de Restricciones (CSP)**.

---

## 🎯 Objetivo

Diseñar e implementar un sistema que permita:

- Generar horarios académicos válidos automáticamente en **≤ 50 segundos**
- Reducir conflictos en la planificación
- Optimizar el uso de recursos (docentes, aulas)
- Mejorar la experiencia de estudiantes y coordinadores

---

## 🚀 Funcionalidades Principales

### 🔹 Gestión Académica
- Registro de estudiantes, docentes, cursos y aulas
- Gestión de datos mediante CRUD

### 🔹 Matrícula Inteligente
- Validación automática de prerrequisitos (nota ≥ 11.00/20)
- Control de límite de créditos (**máximo 6 créditos por semestre**)

### 🔹 Generación de Horarios
- Algoritmo basado en CSP (backtracking + forward checking + heurística MRV)
- Asignación automática sin conflictos

### 🔹 Visualización
- Vista semanal de horarios (L-V, 7:00-21:00)
- Visualización por estudiante, docente y aula

### 🔹 Seguridad
- Autenticación con JWT (expiración 8 horas)
- Control de acceso por roles (Admin, Coordinador, Docente, Estudiante)

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura moderna basada en:

- **Frontend (SPA):** React + Vite
- **Backend (API REST):** FastAPI (Python)
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Motor CSP:** OR-Tools (Google)
---

## ⚙️ Tecnologías Utilizadas

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Frontend | React + Vite | React 18, Vite 5 |
| Estilos | Tailwind CSS | 3.x |
| Estado global | Context API | React 18 |
| Cliente HTTP | Axios | 1.x |
| Backend | FastAPI | 0.115+ |
| Motor CSP | OR-Tools | 9.x |
| Base de datos | PostgreSQL | 15+ |
| Autenticación | JWT (PyJWT) | - |
| Control de versiones | Git + Git Flow | - |

---

## 🧩 Modelado del Problema

El sistema se basa en un modelo de **CSP (Constraint Satisfaction Problem)**:

### Variables:
- Cursos (1-6 créditos cada uno)
- Docentes (disponibilidad MAÑANA/TARDE)
- Estudiantes (límite ≤ 6 créditos)
- Aulas (capacidad 15-40)
- Franjas horarias (L-V, 7:00-21:00, bloques de 1 hora)

### Restricciones Duras (Hard) - 100% obligatorias:
| ID | Restricción | Descripción |
| :--- | :--- | :--- |
| H-01 | No solapamiento estudiante | Un estudiante no puede tener dos cursos en la misma franja |
| H-02 | No solapamiento docente | Un docente no puede dictar dos cursos en la misma franja |
| H-03 | No solapamiento aula | Un aula no puede albergar dos cursos en la misma franja |
| H-04 | Prerrequisitos | Curso A requiere haber aprobado Curso B con nota ≥ 11.00/20 |
| H-05 | Límite de créditos | Suma de créditos ≤ 6 por semestre |
| H-06 | Capacidad de aula | Estudiantes inscritos ≤ capacidad del aula |
| H-07 | Disponibilidad docente | Horario dentro de disponibilidad (MAÑANA/TARDE) |
| H-08 | Nota mínima | Aprobación requiere ≥ 11.00/20 |

## 🔐 Estándares Aplicados

| Estándar | Área de aplicación |
| :--- | :--- |
| **ISO/IEC 25010** | Calidad del software (requisitos no funcionales) |
| **OWASP Top 10** | Seguridad (JWT, prevención SQL injection, XSS) |
| **WCAG 2.1 AA** | Accesibilidad (contraste, navegación por teclado) |
| **W3C** | Desarrollo web (HTML semántico, validación) |
| **Green Software** | Eficiencia energética (código eficiente) |

---

## 🔄 Metodología de Desarrollo

Se utiliza un enfoque ágil basado en:

- **Scrum** con Sprints de 2-3 semanas
- **Duración total:** 16 semanas (Sprint 0 + 4 Sprints)
- **Git Flow** (ramas: `main`, `develop`, `feature/*`, `release/*`)
- **Pull Requests** obligatorios para colaboración

### Planificación de Sprints:

| Sprint | Semanas | Entregable clave |
| :--- | :--- | :--- |
| Sprint 0 | Semana 1 | Documentación inicial, repositorio configurado |
| Sprint 1 | Semanas 2-5 | CRUD + validación de matrícula |
| Sprint 2 | Semanas 6-10 | Motor CSP + autenticación JWT |
| Sprint 3 | Semanas 11-14 | Frontend (UI, visualización, exportación) |
| Sprint 4 | Semanas 15-16 | Pruebas, despliegue, entrega final |

## 📌 Estado del Proyecto

🚧 **En desarrollo (Sprint 0 completado, iniciando Sprint 1)** 🚧

| Hito | Estado |
| :--- | :--- |
| Documentación Sprint 0 | ✅ Completado |
| Repositorio configurado | ✅ Completado |
| CRUD básico | ⏳ En progreso |
| Motor CSP | 📅 Planificado (Sprint 2) |
| Frontend | 📅 Planificado (Sprint 3) |
| Despliegue | 📅 Planificado (Sprint 4) |

---

## 👥 Equipo de Desarrollo

| Nombre | Rol |
| :--- | :--- |
| Sulla Corbetta Jose Luis | Desarrollador Backend |
| Reyes Mendoza Harol Jesus | Desarrollador Frontend |
| Rafael Carpio Fabrizio Alezander | QA / Documentador |
| Vilcahuaman Gonzales Jordan Ricardo | Especialista en Datos |

---

## 📄 Licencia

Este proyecto es desarrollado con fines académicos para el curso **Taller de Proyectos 2 – Ingeniería de Sistemas e Informática**.

---
