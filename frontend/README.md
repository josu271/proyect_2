# 🚀 Frontend - React + Vite + Tailwind

## 📌 Descripción

Este proyecto es un frontend desarrollado con:

* React + Vite
* Tailwind CSS
* Axios
* React Router
* Context API

Diseñado para ser rápido, modular y fácil de escalar.

---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js (recomendado: v18 o superior)
* npm (incluido con Node)

Verificar versiones:

```bash
node -v
npm -v
```

---

## 📦 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
```

Entrar al proyecto:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

---

## ▶️ Ejecutar proyecto

```bash
npm run dev
```

Luego abrir en el navegador:

```
http://localhost:5173
```

---

## 🛠️ Tecnologías usadas

* React (Vite)
* Tailwind CSS v3
* Axios
* React Router DOM
* Context API

---

## 📁 Estructura del proyecto

```bash
src/
│
├── api/          # Configuración de Axios
├── components/   # Componentes reutilizables
├── context/      # Context API
├── pages/        # Vistas principales
├── routes/       # Rutas (opcional)
├── hooks/        # Custom hooks
└── assets/       # Imágenes, estilos, etc.
```

---

## 🌐 Variables de entorno (opcional)

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

Uso en Axios:

```js
baseURL: import.meta.env.VITE_API_URL
```

---

## 📦 Dependencias principales

Estas se instalan automáticamente con `npm install`, pero son:

```bash
npm install axios react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
```

---

## ❗ Notas importantes

* No subir `node_modules`
* Asegurarse de tener el archivo `index.css` con Tailwind
* Ejecutar siempre `npm install` al clonar

---

## 👨‍💻 Autor

Tu nombre aquí

---

## 📄 Licencia

Este proyecto es de uso libre.
