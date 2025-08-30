# Calculadora de Riesgos

Una aplicación completa para cálculo de riesgos utilizando métodos RPN (Risk Priority Number) y WEIGHTED (Ponderado).

## 🏗️ Arquitectura

Este proyecto está dividido en dos partes:

- **Backend** (`calculadora-riesgo/`): API REST construida con Express.js
- **Frontend** (`react-calculadora/`): Aplicación web construida con React y Vite

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+ (recomendado)
- npm

### 1. Backend (API)

```bash
cd calculadora-riesgo
npm install
npm run dev
```

El servidor estará disponible en: `http://localhost:3000/api`

### 2. Frontend (React)

```bash
cd react-calculadora
npm install
npm run dev
```

La aplicación web estará disponible en: `http://localhost:5173`

## 📋 Scripts Disponibles

### Backend
- `npm start`: Ejecuta el servidor en modo producción
- `npm run dev`: Ejecuta el servidor en modo desarrollo con auto-reload

### Frontend
- `npm run dev`: Ejecuta la aplicación en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
- `npm run lint`: Ejecuta el linter

## 🔧 Estructura del Proyecto

```
Calculadora-de-riesgos/
├── calculadora-riesgo/          # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/         # Controladores de la API
│   │   ├── routes/             # Rutas de la API
│   │   ├── services/           # Lógica de negocio
│   │   ├── middlewares/        # Middlewares
│   │   ├── config/             # Configuración
│   │   └── server.js           # Punto de entrada
│   └── package.json
├── react-calculadora/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Servicios para API calls
│   │   └── assets/             # Recursos estáticos
│   └── package.json
└── README.md
```

## 🌟 Funcionalidades

- Cálculo de riesgos mediante método RPN
- Cálculo de riesgos mediante método WEIGHTED
- Interfaz web intuitiva y moderna
- API REST para integración con otros sistemas
- Procesamiento por lotes de múltiples riesgos

## 🔗 API Endpoints

### Método RPN
- `POST /api/risks/rpn` - Calcula riesgo usando método RPN

### Método WEIGHTED
- `POST /api/risks/weighted` - Calcula riesgo usando método ponderado

## ⚠️ Notas

- Si aparecen advertencias sobre la versión de Node.js, considera actualizar a la versión 22.12.0 o superior
- Asegúrate de que ambos servicios (backend y frontend) estén ejecutándose para el funcionamiento completo de la aplicación

## 📄 Licencia

MIT
