# Build
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN pnpm install

# Copy the source code and build
COPY . .
RUN pnpm run build

# Production
FROM node:24-alpine
WORKDIR /app

# Copy built file from builder
COPY --from=builder /app/.output ./.output

# Expose the port
EXPOSE 3000

# Start Nuxt production server
CMD ["node", "./.output/server/index.mjs"]