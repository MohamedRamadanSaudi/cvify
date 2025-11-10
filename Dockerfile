# Use Bun as base image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy application code
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production image
FROM base AS production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads/cvs

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start:prod"]
