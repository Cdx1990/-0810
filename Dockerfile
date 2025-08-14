# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]