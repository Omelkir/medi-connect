# Utilise l'image officielle Node.js comme base
FROM node:20.11.1-bullseye

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires à l'installation
COPY package.json yarn.lock ./

# Installer les dépendances avec yarn
RUN yarn install --frozen-lockfile

# Copier le reste de l'application
COPY . .

# Copier le fichier .env
COPY .env .env

# Supprimer l'ancien build
RUN rm -rf .next

# Construire l'application Next.js
RUN yarn build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Lancer l'application
CMD ["yarn", "start"]
