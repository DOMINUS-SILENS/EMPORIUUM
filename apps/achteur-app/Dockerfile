# Stage 1: Build the Acheteur app
FROM node:18-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --no-audit --prefer-offline --no-fund

# Copie des fichiers partagés si monorepo
COPY ../shared ./shared

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN apk --no-cache add curl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
