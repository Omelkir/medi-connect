# Utilise l'image officielle Node.js comme base
FROM node:20.11.1-bullseye

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier tous les fichiers du projet dans l'image Docker
COPY . .

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Supprimer l'ancien build
RUN rm -rf .next

# Construire l'application Next.js
RUN yarn build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Lancer l'application
CMD ["yarn", "start"]
