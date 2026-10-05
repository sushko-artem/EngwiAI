# Development stage
ARG NODE_VERSION=24.21.0
FROM node:${NODE_VERSION}-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]