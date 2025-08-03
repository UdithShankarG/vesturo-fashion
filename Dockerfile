# Multi-stage Docker build for Vesturo Fashion Platform

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend
FROM node:18-alpine AS backend-setup

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

# Stage 3: Production Image
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S vesturo -u 1001

WORKDIR /app

# Copy backend files
COPY --from=backend-setup --chown=vesturo:nodejs /app/backend ./backend
# Copy built frontend files
COPY --from=frontend-builder --chown=vesturo:nodejs /app/frontend/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p /app/backend/uploads && chown vesturo:nodejs /app/backend/uploads

USER vesturo

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

WORKDIR /app/backend

CMD ["dumb-init", "node", "server.js"]
