# Étape 1 : Build React (On compile le code)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
# Installation propre des dépendances
RUN npm install
COPY . .
# Création du dossier /dist (ou /build selon votre config)
RUN npm run build

# Étape 2 : Serveur Nginx final (Le résultat est ultra-léger)
FROM nginx:alpine
# On récupère uniquement le résultat du build
COPY --from=build /app/dist /usr/share/nginx/html

# On copie ta configuration Nginx qui gère les routes /api et /ai
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]