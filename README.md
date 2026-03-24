# 🌿 Sistema Web Inteligente para Turismo en Chanchamayo

## 📌 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un sistema web inteligente orientado a optimizar la gestión y promoción de servicios turísticos en la zona de Chanchamayo.

La plataforma permite a los usuarios explorar paquetes turísticos, recibir recomendaciones personalizadas, realizar reservas y simular pagos en línea. Además, incorpora un chatbot automatizado que mejora la atención al cliente y un panel administrativo para la gestión eficiente del negocio.

---

## 🎯 Objetivos

### Objetivo General

Desarrollar un sistema web inteligente que mejore la experiencia del turista y optimice la toma de decisiones en una empresa de turismo.

### Objetivos Específicos

* Permitir la gestión de paquetes turísticos.
* Ofrecer recomendaciones personalizadas a los usuarios.
* Implementar un sistema de reservas en línea.
* Integrar un chatbot para atención automatizada.
* Facilitar el análisis de demanda turística.

---

## 🧩 Alcance del Sistema

El sistema incluye:

* Registro e inicio de sesión de usuarios.
* Exploración de paquetes turísticos.
* Recomendación de rutas según preferencias.
* Reserva de paquetes turísticos.
* Simulación de pagos.
* Chatbot automatizado para atención al cliente.
* Panel administrativo para gestión de servicios.
* Visualización de destinos en mapas.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura basada en:

* Frontend desacoplado
* Backend con API REST
* Base de datos relacional
* Automatización mediante workflows

### Estructura general:

Frontend → Backend → Automatización (chatbot) → Base de datos

---

## ⚙️ Tecnologías Utilizadas

### 🖥️ Frontend

* React + Vite
* Tailwind CSS
* Axios
* React Router

### ⚙️ Backend

* FastAPI (Python) o Node.js + Express
* API REST
* Autenticación con JWT

### 🤖 Chatbot y Automatización

* n8n (workflow automation)
* Lógica basada en reglas

### 🗄️ Base de Datos

* PostgreSQL

### 🗺️ Mapas

* Leaflet + OpenStreetMap

### 💳 Pagos

* Simulación de pagos (sin integración real)

---

## 🧠 Funcionalidades Inteligentes

### 🔹 Sistema de Recomendación

El sistema sugiere rutas turísticas en base a:

* Presupuesto del usuario
* Intereses (naturaleza, aventura, cultura)
* Disponibilidad de paquetes

### 🔹 Predicción de Demanda (Básica)

Permite analizar tendencias de reservas para:

* Optimizar promociones
* Mejorar la planificación de servicios

### 🔹 Chatbot Automatizado

Implementado con n8n, permite:

* Responder preguntas frecuentes
* Recomendar paquetes
* Brindar soporte básico al usuario

---

## 👥 Tipos de Usuario

### 👤 Cliente

* Registro e inicio de sesión
* Exploración de paquetes
* Reservas
* Interacción con chatbot

### 🛠️ Administrador

* Gestión de paquetes turísticos
* Control de precios
* Visualización de demanda
* Administración del sistema

---

## 🔄 Metodología de Desarrollo

Se utilizó el modelo incremental, permitiendo el desarrollo del sistema por fases:

1. Módulo de usuarios y autenticación
2. Gestión de paquetes turísticos
3. Sistema de reservas
4. Chatbot y automatización
5. Recomendaciones y mejoras

---

## 🚀 Ventajas del Sistema

* Mejora la experiencia del usuario
* Automatiza procesos de atención
* Permite tomar decisiones basadas en datos
* Reduce costos mediante herramientas open source
* Escalable y modular

---

## ⚠️ Limitaciones

* Sistema de pagos simulado (no real)
* Recomendaciones basadas en reglas simples
* Chatbot sin IA avanzada (modo gratuito)

---

## 📈 Posibles Mejoras Futuras

* Integración de pagos reales (Stripe, PayPal)
* Implementación de inteligencia artificial avanzada
* Aplicación móvil
* Integración con APIs de clima en tiempo real
* Mejora del sistema de recomendación (Machine Learning)

---

## 🧑‍💻 Instalación y Ejecución (Resumen)

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### n8n

```bash
npx n8n
```

---

## 📄 Conclusión

El sistema propuesto representa una solución moderna, escalable y eficiente para el sector turístico, integrando automatización, análisis de datos y una experiencia interactiva para el usuario, todo ello utilizando tecnologías accesibles y de bajo costo.

---

## 📚 Autor

Proyecto desarrollado como parte del curso de Taller de Proyecto.
