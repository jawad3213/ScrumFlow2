# Étape 1 : Base Dev & Build (Node.js React)
FROM node:20-alpine as dev
WORKDIR /app
COPY package*.json ./
# Installation propre des dépendances
RUN npm install
COPY . .
# On expose 5173 pour Vite
EXPOSE 5173
# Commande pour le server de développement (Hot Reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Étape 2 : Build React (On compile le code pour la production)
FROM dev as build
RUN npm run build

# Étape 3 : Serveur Nginx final (Le résultat est ultra-léger)
FROM nginx:alpine as prod
# On récupère uniquement le résultat du build
COPY --from=build /app/dist /usr/share/nginx/html

# On copie une configuration Nginx simple pour servir les fichiers statiques
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]