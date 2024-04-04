# Etapa de construcción
FROM node:slim as build
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de ejecución
FROM node:slim
WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/migrations/ ./migrations
COPY package.json ./
RUN npm install
CMD ["node", "dist/src/main.js"]
