# Utilise une image officielle de Node.js avec Debian
FROM node:20.11.1-bullseye

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation des dépendances
COPY package.json yarn.lock ./

# Installer les dépendances sans modifier le lockfile
RUN yarn install --frozen-lockfile

# Copier le reste des fichiers de l'application
COPY . .

# Supprimer un éventuel ancien build (optionnel mais prudent)
RUN rm -rf .next

# Construire l'application Next.js
RUN yarn build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Démarrer l'application
CMD ["yarn", "start"]
