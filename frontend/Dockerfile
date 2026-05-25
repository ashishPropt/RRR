FROM node:22-alpine AS builder
WORKDIR /app
# Copy only package.json — NOT the lock file.
# The lock file is built on Windows and contains Windows-specific binaries
# (rollup, etc.). Alpine needs linux-x64-musl variants, so we let npm
# resolve deps fresh inside the container each time.
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
