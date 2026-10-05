# Development stage
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]