# Stage 1 — Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies install karo
COPY package*.json ./
RUN npm install

# Code copy karo aur build karo
COPY . .
RUN npm run build

# Stage 2 — Nginx se serve karo
FROM nginx:alpine

# Build output copy karo nginx mein
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config copy karo (React router ke liye)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]