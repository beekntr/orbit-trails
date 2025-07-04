# Use Node.js LTS as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:backend

# Production stage
FROM node:18-alpine AS production

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S orbit-trails -u 1001

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ecosystem.config.js ./

# Create logs directory
RUN mkdir logs && chown -R orbit-trails:nodejs logs

# Change ownership
RUN chown -R orbit-trails:nodejs /app

# Switch to non-root user
USER orbit-trails

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
