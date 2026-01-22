#!/bin/sh
set -e

echo "🚀 Starting Rapi Crédito Server..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => { console.log('Database connected'); process.exit(0); })
  .catch(() => { console.log('Database not ready'); process.exit(1); });
" > /dev/null 2>&1; do
  echo "⏳ Database not ready, waiting 5 seconds..."
  sleep 5
done

echo "✅ Database connection established"

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Initialize database
echo "🔄 Initializing database..."
node init-db.js

echo "🚀 Starting application..."
exec node dist/index.js
