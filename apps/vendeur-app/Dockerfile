# Stage 1: Build the Vendeur app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Environment variables
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --prefer-offline --no-fund

# Copy shared code (si structure monorepo)
COPY ../shared ./shared

# Copy app source
COPY . .

# Build
RUN npm run build

# Stage 2: Production image with Nginx
FROM nginx:1.25-alpine

# Add curl for healthchecks
RUN apk --no-cache add curl

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Permissions (Nginx runs as nginx user)
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Run as nginx user
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
