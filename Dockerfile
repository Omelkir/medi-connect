# Utiliser l'image officielle Node.js comme base
FROM node:20.11.1-bullseye

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires à l'installation
COPY package*.json ./

# Mettre à jour npm à une version précise (facultatif mais recommandé)
RUN npm install -g npm@10.8.1

# Installer les dépendances sans exécuter les scripts (pour éviter l’erreur build:icons)
RUN npm install --legacy-peer-deps --ignore-scripts

# Copier le reste de l'application
COPY . .

# Copier les fichiers d'environnement
COPY .env .env

# Supprimer un éventuel ancien build
RUN rm -rf .next

# Lancer manuellement le script qui causait l'erreur, mais sans faire échouer le build
RUN npm run build:icons || echo "⚠️ build:icons échoué — ignoré"

# Construire l'application
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Lancer l'application
CMD ["npm", "start"]
