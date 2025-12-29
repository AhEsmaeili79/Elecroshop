# Development Dockerfile with hot reload using Bun
FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy source code (will be overridden by volume mount in docker-compose)
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run development server with hot reload using Bun
CMD ["bun", "run", "dev"]
