# Utilise l'image officielle Node.js comme base
FROM node:20.11.1-bullseye

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install -g npm@10.8.1
RUN npm install --legacy-peer-deps

# Copier le reste de l'application
COPY . .

# Copier le fichier .env
COPY .env .env

# Supprimer l'ancien build
RUN rm -rf .next

# Construire l'application Next.js
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Lancer l'application
CMD ["npm", "start"]
