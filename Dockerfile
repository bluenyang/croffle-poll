# Build
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json yarn.lock* .yarnrc.yml* ./
RUN corepack enable
RUN yarn set version canary
RUN yarn install --immutable

# Copy the source code and build
COPY . .
RUN yarn build

# Production
FROM node:24-alpine
WORKDIR /app

# Copy built file from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle ./drizzle

# Expose the port
EXPOSE 3000

# Start Nuxt production server
CMD ["node", "./.output/server/index.mjs"]