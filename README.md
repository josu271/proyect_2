# 📚 Sistema Web de Generación Óptima de Horarios Académicos

## 📌 Tabla de Contenidos (TOC)

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Contexto del Problema](#-contexto-del-problema)
3. [Objetivos del Proyecto](#-objetivos-del-proyecto)
4. [Análisis del Negocio Académico](#-análisis-del-negocio-académico)
6. [Stakeholders Involucrados](#-stakeholders-involucrados)
7. [Indicadores Clave de Éxito (KPIs)](#-indicadores-clave-de-éxito-kpis)
8. [Funcionalidades Principales](#-funcionalidades-principales)
9. [Arquitectura del Sistema](#-arquitectura-del-sistema)
10. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
11. [Estándares y Buenas Prácticas Aplicadas](#-estándares-y-buenas-prácticas-aplicadas)
12. [Metodología de Desarrollo](#-metodología-de-desarrollo)
13. [Equipo de Desarrollo](#-equipo-de-desarrollo)
14. [Licencia](#-licencia)

---

# 🧠 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un sistema web inteligente orientado a la generación óptima de horarios académicos universitarios, considerando restricciones académicas, disponibilidad docente, asignación de aulas y optimización de recursos institucionales.

El sistema busca reducir conflictos de horarios, minimizar tiempos muertos y mejorar la planificación académica mediante técnicas de optimización combinatoria y CSP (Constraint Satisfaction Problem).

---

# 🌎 Contexto del Problema

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

# 🎯 Objetivos del Proyecto

## Objetivo General

Desarrollar un sistema web capaz de generar horarios académicos óptimos automáticamente considerando restricciones institucionales y criterios de optimización.

## Objetivos Específicos

- Reducir conflictos de horarios académicos
- Optimizar la asignación de docentes y aulas
- Minimizar tiempos muertos entre clases
- Mejorar la experiencia de estudiantes y coordinadores
- Automatizar el proceso de planificación académica
- Facilitar la validación operativa de horarios

---

# 🏢 Análisis del Negocio Académico

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

# 👥 Stakeholders Involucrados

| Stakeholder | Rol |
| :--- | :--- |
| Estudiantes | Seleccionan cursos y visualizan horarios |
| Docentes | Dictan cursos según disponibilidad y carga académica |
| Coordinadores Académicos | Supervisan planificación académica |
| Administradores | Gestionan recursos institucionales |
| Sistema | Genera horarios automáticamente mediante CSP |

---

# 📈 Indicadores Clave de Éxito (KPIs)

| KPI | Objetivo |
| :--- | :--- |
| Reducción de conflictos académicos | ≥ 70% |
| Tiempo de generación de horarios | ≤ 50 segundos |
| Uso eficiente de aulas | ≥ 85% |
| Reducción de horas muertas | ≥ 60% |
| Satisfacción estudiantil | ≥ 80% |
| Horarios válidos generados | ≥ 95% |

---

# 🚀 Funcionalidades Principales

## 🔹 Gestión Académica
- Registro de estudiantes, docentes, cursos y aulas
- Gestión de datos mediante CRUD

## 🔹 Generación de Horarios
- Validación de prerrequisitos
- Control de créditos permitidos

## 🔹 Generación de Horarios
- Motor basado en CSP y optimización combinatoria
- Generación automática sin conflictos
- Minimización de horas muertas

## 🔹 Visualización
- Vista semanal de horarios
- Filtros por estudiante, docente, aula y ciclo

## 🔹 Seguridad
- Autenticación JWT
- Control de acceso por roles

---

# 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura moderna basada en:

- Frontend SPA
- Backend API REST
- Base de datos relacional
- Motor CSP para optimización
- Autenticación JWT

---

# ⚙️ Tecnologías Utilizadas

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React + Vite |
| Backend | FastAPI |
| Base de datos | PostgreSQL |
| Motor CSP | OR-Tools |
| Autenticación | JWT |
| Control de versiones | Git + GitHub |

---

# 🧩 Modelado del Problema

El sistema se modela mediante CSP (Constraint Satisfaction Problem).

## Variables
- Cursos
- Docentes
- Aulas
- Horarios
- Estudiantes

## Restricciones Duras
- No solapamiento de docentes
- No solapamiento de aulas
- No solapamiento de estudiantes
- Disponibilidad docente
- Capacidad de aulas
- Validación de prerrequisitos

## Restricciones Blandas
- Minimización de horas muertas
- Preferencias horarias
- Balance de carga académica

---

# 🔐 Estándares y Buenas Prácticas Aplicadas

| Estándar | Aplicación |
| :--- | :--- |
| ISO/IEC 25010 | Calidad del software |
| OWASP Top 10 | Seguridad |
| WCAG 2.1 AA | Accesibilidad |
| Git Flow | Control de versiones |
| Scrum | Gestión ágil |
| TDD | Calidad y testing |

---

# 🔄 Metodología de Desarrollo

El proyecto utiliza:

- Scrum
- Git Flow
- TDD
- Conventional Commits
- Desarrollo incremental basado en MVP

---


# 👥 Equipo de Desarrollo

| Nombre | Rol |
| :--- | :--- |
| Sulla Corbetta Jose Luis | Backend Developer |
| Reyes Mendoza Harol Jesus | Frontend Developer |
| Rafael Carpio Fabrizio Alezander | QA / Documentación |
| Vilcahuaman Gonzales Jordan Ricardo | Especialista en Datos |

---

# 📄 Licencia

Proyecto desarrollado con fines académicos para el curso Taller de Proyectos 2 – Ingeniería de Sistemas e Informática.
