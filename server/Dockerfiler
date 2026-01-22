# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Copy database initialization script
COPY --from=builder /app/init-db.js ./init-db.js

# Generate Prisma Client
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["./start.sh"]
