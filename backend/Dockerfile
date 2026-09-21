
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./

COPY prisma/schema.prisma ./prisma/

RUN apk add --no-cache curl

RUN npm install

RUN DATABASE_URL="postgresql://stub:stub@localhost:5432/stub" npx prisma generate

COPY . .

CMD [ "npm", "run", "start:dev" ]