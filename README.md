# 📚 Sistema de Generación Óptima de Horarios Académicos

## 🧠 Descripción del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web inteligente capaz de generar horarios académicos óptimos en universidades con currículo flexible.

El problema aborda la complejidad en la planificación de horarios, considerando múltiples variables y restricciones como:

- Disponibilidad de docentes
- Prerrequisitos de cursos
- Límite de créditos por estudiante
- Capacidad de aulas
- No solapamiento de horarios

Se trata de un problema de **alta complejidad (NP-hard)**, modelado como un **Problema de Satisfacción de Restricciones (CSP)**.

---

## 🎯 Objetivo

Diseñar e implementar un sistema que permita:

- Generar horarios académicos válidos automáticamente
- Reducir conflictos en la planificación
- Optimizar el uso de recursos (docentes, aulas)
- Mejorar la experiencia de estudiantes y coordinadores

---

## 🚀 Funcionalidades Principales

### 🔹 Gestión Académica
- Registro de estudiantes, docentes, cursos y aulas
- Gestión de datos mediante CRUD

### 🔹 Matrícula Inteligente
- Validación automática de prerrequisitos
- Control de límite de créditos (20–22)

### 🔹 Generación de Horarios
- Algoritmo basado en CSP
- Asignación automática sin conflictos

### 🔹 Visualización
- Vista semanal de horarios
- Visualización por estudiante, docente y aula

### 🔹 Seguridad
- Autenticación con JWT
- Control de acceso por roles

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura moderna basada en:

- **Frontend (SPA):** React + Vite  
- **Backend (API REST):** FastAPI (Python)  
- **Base de datos:** PostgreSQL  
- **Autenticación:** JWT  

### 🔄 Comunicación
- Cliente ↔ API mediante HTTP (REST)
- API ↔ Motor CSP (servicio interno en Python)

---

## ⚙️ Tecnologías Utilizadas

| Capa        | Tecnología        |
|------------|------------------|
| Frontend   | React + Vite     |
| Estilos    | Tailwind CSS     |
| Backend    | FastAPI          |
| Base de datos | PostgreSQL   |
| Autenticación | JWT           |
| Control de versiones | Git + Git Flow |

---

## 🧩 Modelado del Problema

El sistema se basa en un modelo de **CSP (Constraint Satisfaction Problem)**:

### Variables:
- Cursos
- Docentes
- Estudiantes
- Aulas
- Horarios

### Restricciones:
- No solapamiento de horarios
- Prerrequisitos académicos
- Límite de créditos
- Disponibilidad de recursos

### Enfoque:
- Backtracking + heurísticas (MRV, forward checking)
- Optimización combinatoria

---

## 📊 Requisitos No Funcionales

El sistema cumple con estándares de calidad:

- ⚡ Rendimiento: generación < 30 segundos  
- 🔒 Seguridad: OWASP Top 10  
- ♿ Usabilidad: WCAG 2.1  
- 📈 Escalabilidad: múltiples usuarios concurrentes  
- 🧩 Mantenibilidad: código modular  

---

## 🔐 Estándares Aplicados

- ISO/IEC 25010 (Calidad del software)
- OWASP Top 10 (Seguridad)
- WCAG 2.1 (Accesibilidad)
- W3C (Desarrollo web)
- Green Software (Eficiencia energética)

---


---

## 🔄 Metodología de Desarrollo

Se utiliza un enfoque ágil basado en:

- **Scrum** (Sprints de 2 semanas)
- **Git Flow** (ramas feature, develop, main)
- Desarrollo incremental

---

## 🧪 Pruebas

- Pruebas unitarias (lógica del CSP)
- Pruebas de integración (API)
- Cobertura objetivo: ≥ 70%

---

## 🌱 Impacto del Proyecto

### Técnico
- Automatización de un problema complejo
- Uso de algoritmos de optimización

### Social
- Mejora en la experiencia académica
- Reducción de conflictos de horarios

### Económico
- Reducción de tiempo y costos operativos

### Ambiental
- Uso eficiente de recursos computacionales (Green Software)

---

## 📌 Estado del Proyecto

🚧 En desarrollo (MVP en progreso)

---

## 👥 Equipo de Desarrollo

- Backend Developer  
- Frontend Developer  
- QA / Documentación  
- Especialista en datos  

---

## 📄 Licencia

Este proyecto es desarrollado con fines académicos.

---

## 📬 Contacto

Para más información, revisar la carpeta `/docs` o contactar al equipo de desarrollo.
sullacorbetta@gmail.com
