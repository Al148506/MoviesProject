# Etapa 1: Construcción de la app Angular
FROM node:18-alpine AS build
WORKDIR /app

# Copiamos los archivos del proyecto
COPY . .

# Instalamos dependencias y construimos
RUN npm install --legacy-peer-deps && npm run build --prod