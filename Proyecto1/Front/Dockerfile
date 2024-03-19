# Primera etapa: Construir la aplicación frontend
FROM node:18 AS build

WORKDIR /frontend

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

# Segunda etapa: Crear la imagen de Nginx y copiar los archivos construidos
FROM nginx:alpine

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos generados de la primera etapa
COPY --from=build /frontend/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]