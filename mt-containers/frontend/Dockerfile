# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY apps/frontend/package.json apps/frontend/package-lock.json ./
RUN npm ci
COPY apps/frontend/ .
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY mt-containers/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
