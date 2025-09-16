# DocsFlow Frontend - Sistema de Gestión de Documentos

## 📋 Descripción
Interfaz React + TypeScript para la gestión de documentos operativos empresariales. Upload, visualización y búsqueda de PDFs procesados.

## 🛠️ Stack Tecnológico
- **React ** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)

## 🚀 Instalación Rápida

### 1. Clonar e instalar
```bash
git clone https://github.com/hdvalen/DocsFlow-Fronted.git
cd DocsFlow-Fronted
npm install
```

### 2. Ejecutar
```bash
npm run dev  # Desarrollo en http://localhost:5173
npm run build  # Producción
```

## 🔐 Funcionalidades Principales

### 🏠 Dashboard
- **Admin**: Estadísticas generales, gestión completa
- **Operator**: Documentos de su departamento únicamente

## 🛣️ Rutas

### Públicas
```
/login → Login
/forgot-password → Recuperar contraseña
```

### Protegidas
```
/dashboard → Panel principal
/documents → Lista de documentos
/documents/:id → Detalle
/users → Gestión usuarios (admin)
/profile → Perfil personal
```

## 📦 Scripts Principales
```bash
npm run dev        # Servidor desarrollo
npm run build      # Build producción
npm run preview    # Preview del build
npm run lint       # Linter
npm run type-check # Verificar tipos TS
```

## 🔧 Desarrollo

### Variables de Entorno
```env
# Desarrollo
VITE_API_BASE_URL=http://localhost:8000

# Producción  
VITE_API_BASE_URL=https://api.docsflow.com
```

## 🔧 Troubleshooting

### CORS Error
Verificar configuración CORS en el backend

### Build Error
```bash
rm -rf node_modules package-lock.json
npm install
npm run type-check
```

### API Connection
Verificar `VITE_API_BASE_URL` y que el backend esté corriendo
