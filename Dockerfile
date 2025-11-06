# Dockerfile placeholder
# ---------------------------------------
# Dockerfile for notification-ui
# ---------------------------------------
FROM nginx:alpine

# Copy Vite build output
COPY dist/ /usr/share/nginx/html

# Copy custom Nginx config 
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
