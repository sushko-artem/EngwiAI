
# Development stage
FROM node:20-alpine AS development

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./

COPY prisma/schema.prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

CMD [ "npm", "run", "start:dev" ]