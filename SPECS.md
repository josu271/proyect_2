# SPECS.md

# Descripción del Proyecto

Desarrollar un sistema inteligente de generación de horarios académicos para currículas flexibles utilizando técnicas de **Problemas de Satisfacción de Restricciones (CSP)**.

## Tecnologías

PostgreSQL (Base de datos)
FastAPI (Backend en Python)
React + Vite (Frontend)

---

# Objetivo del Sistema

Generar automáticamente horarios académicos válidos respetando reglas institucionales, disponibilidad de recursos y restricciones académicas.

---

# Entradas del Sistema

Cursos seleccionados por el estudiante
Historial académico (notas)
Créditos de cada curso
Disponibilidad de docentes (MAÑANA / TARDE)
Disponibilidad de aulas
Capacidad de aulas
Reglas institucionales (límite de créditos, prerrequisitos)
Parámetros del sistema

---

# Salidas del Sistema

Horario generado (estructura semanal: días vs horas)
Estado de validación (válido / inválido)
Reporte de conflictos:
  - Solapamientos de horario
  - Incumplimiento de prerrequisitos
  - Conflictos de recursos
Lista de cursos asignados
Exportación a PDF (opcional)

---

# Actores del Sistema

## Estudiante
Seleccionar cursos
Validar matrícula
Visualizar horario
Exportar horario

## Docente
Registrar disponibilidad
Ver horario asignado
Ver aulas asignadas

## Coordinador
Generar horarios mediante CSP
Validar restricciones
Ver reportes de conflictos

## Administrador
CRUD de estudiantes, docentes, cursos y aulas
Gestión de usuarios y roles
Visualización de auditoría

---

# Reglas de Negocio

Un estudiante debe cumplir los prerrequisitos para matricularse
Nota mínima aprobatoria: **11/20**
Máximo de créditos por semestre: **6 créditos**
No puede haber solapamiento de horarios
Un docente no puede dictar dos cursos al mismo tiempo
Un aula no puede ser asignada a más de un curso simultáneamente
Se debe respetar la disponibilidad del docente
Se debe respetar la disponibilidad del aula

---

# Restricciones del Sistema (CSP)

## Restricciones Duras

No solapamiento de horarios
Cumplimiento de prerrequisitos
Límite de créditos respetado
Disponibilidad docente respetada
Capacidad del aula no excedida
No duplicidad de recursos (docente/aula en el mismo horario)

## Restricciones Blandas

Minimizar espacios vacíos en el horario
Respetar preferencias de turno
Balancear carga académica
Reducir tiempos muertos entre clases

---

# Casos Límite

No existe solución válida → retornar error controlado
Existen múltiples soluciones → seleccionar la mejor
Datos incompletos → bloquear generación de horario
Conflicto total → generar reporte detallado
No hay docente disponible → marcar conflicto
No hay aula disponible → marcar conflicto

---

# Requisitos Funcionales

## Estudiante

Seleccionar cursos
Validar prerrequisitos automáticamente (nota ≥ 11)
Validar límite de créditos (≤ 6)
Visualizar horario generado
Exportar horario a PDF

## Docente

Registrar disponibilidad
Ver horario asignado
Ver aulas asignadas

## Coordinador

Generar horarios (CSP)
Validar restricciones
Visualizar horarios
Generar reportes de conflicto

## Administrador

CRUD de estudiantes
CRUD de docentes
CRUD de cursos
CRUD de aulas
Gestión de usuarios y roles
Visualizar auditoría

---

# Funcionalidades

| Funcionalidad | Estado |
|--------------|--------|
| Autenticación (JWT, 4 roles) | Requerido |
| CRUD Estudiantes | Requerido |
| CRUD Docentes | Requerido |
| CRUD Cursos | Requerido |
| CRUD Aulas | Requerido |
| Validación de matrícula | Requerido |
| Generación de horarios (CSP) | Requerido |
| Vista semanal de horarios | Requerido |
| Reporte de conflictos | Requerido |
| Exportación a PDF | Deseado |
| Auditoría | Deseado |

---

# API (Resumen)

## Autenticación
POST /api/auth/login  
POST /api/auth/register  

## Estudiantes
GET /api/estudiantes  
POST /api/estudiantes  
PUT /api/estudiantes/{id}  
DELETE /api/estudiantes/{id}  
POST /api/estudiantes/{id}/matricula  
GET /api/estudiantes/{id}/horario  

## Docentes
GET /api/docentes  
POST /api/docentes  
PUT /api/docentes/{id}/disponibilidad  

## Cursos
GET /api/cursos  
POST /api/cursos  
PUT /api/cursos/{id}  
DELETE /api/cursos/{id}  

## Aulas
GET /api/aulas  
POST /api/aulas  
PUT /api/aulas/{id}  
DELETE /api/aulas/{id}  

## Horarios
POST /api/horarios/generar  
GET /api/horarios  
GET /api/horarios/conflictos  

---

# Modelo de Datos (Alto Nivel)

Tablas:

estudiantes
docentes
cursos
aulas
horarios

Relaciones:

estudiante → cursos
docente → cursos
curso → aula
horario → estudiante / docente / aula

---

# Requisitos de Interfaz (UI)

Diseño responsive (Tailwind CSS)
Dashboard por rol
Formularios con validación
Vista semanal de horarios
Visualización de conflictos
Exportación a PDF

---

# Requisitos No Funcionales

Generación de horario < **50 segundos**
Soporte:
  - 30 cursos
  - 20 docentes
  - 15 aulas
Autenticación JWT (expiración 8h)
Accesibilidad (WCAG 2.1 AA)
Seguridad (OWASP Top 10)
Cobertura de pruebas ≥ 70%
Arquitectura modular

---

# Criterios de Aceptación

El sistema se considera completo cuando:

Todas las funcionalidades están implementadas
El CSP genera horarios válidos
No existen conflictos en resultados finales
CRUD funciona correctamente
Autenticación operativa
Cobertura de pruebas ≥ 70%
Documentación completa

---

# Mejoras Futuras

Optimización multiobjetivo
Preferencias de estudiantes
Cursos con múltiples bloques
Aulas especializadas
Exportación iCalendar
Soporte multi-campus

---

# Cumplimiento SDD

Este documento define entradas, salidas, reglas de negocio, restricciones y casos límite, reduciendo ambigüedad y asegurando coherencia entre especificación, modelado e implementación.
