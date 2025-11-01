# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
# Copy bun.lockb only if it exists
COPY bun.lock* ./

COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json ./
COPY bun.lock* ./

COPY prisma ./prisma/

# Install production dependencies only
RUN bun install --production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated

# Copy public directory
COPY public ./public

# Create necessary directories with proper permissions
RUN mkdir -p uploads/cvs generated && \
    chown -R bun:bun /app

# Switch to non-root user
USER bun

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "run", "dist/main.js"]