FROM node:20.11.1-bullseye

WORKDIR /app

# Copier fichiers nécessaires au yarn install
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copier le reste (y compris le fichier manquant)
COPY . .

# (Optionnel) Compiler les icônes si besoin
RUN yarn build:icons

# Supprimer ancien build
RUN rm -rf .next

# Compiler le projet Next.js
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]
