# Base image
FROM nginx:1.25-alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Expose port and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
