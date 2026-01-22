#!/bin/sh
set -e

echo "🚀 Starting Rapi Crédito Server..."

# Wait for database to be ready
echo "⏳ Attempting database initialization..."
# Run prisma generate (needed for the app to start)
npx prisma generate

# Attempt init-db but don't block everything if it fails (the app will log the error)
node init-db.js || echo "⚠️ Database initialization skipped or failed. Check logs."

echo "🚀 Starting application..."
exec node dist/index.js
