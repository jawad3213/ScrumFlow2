# Stage 1: development server (docker-compose.override.yml uses this target, with hot reload)
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
# Exact versions from package-lock.json
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 2: production bundle (VITE_* values are baked in here, at build time)
FROM dev AS build
RUN npm run build

# Stage 3: static files served by a small nginx, behind the gateway (frontend/nginx)
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
