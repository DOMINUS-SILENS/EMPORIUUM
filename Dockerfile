FROM node:20

# Dépendances nécessaires
RUN npm install -g pnpm@9.6.0

WORKDIR /usr/src/app

COPY . .

# Installer les dépendances avec pnpm
RUN pnpm install

# Assure-toi que turbo est installé localement
RUN pnpm add -D turbo@2.0.9

# Compiler les packages
RUN pnpm turbo build

EXPOSE 3000 9229

CMD ["pnpm", "dev"]
