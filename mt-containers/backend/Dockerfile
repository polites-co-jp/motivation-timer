FROM node:22-alpine AS build
WORKDIR /app
COPY apps/backend/package.json apps/backend/package-lock.json ./
RUN npm ci
COPY apps/backend/ .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
