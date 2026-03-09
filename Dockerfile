# Dockerfile para Backend Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json del backend
COPY backend/package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código del backend
COPY backend/ ./

# Exponer puerto
EXPOSE 8000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8000

# Comando de inicio
CMD ["node", "server.js"]
