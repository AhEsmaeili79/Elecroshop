# Development Dockerfile with hot reload
FROM node:20-alpine

# Install dependencies for development
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code (will be overridden by volume mount in docker-compose)
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run development server with hot reload
CMD ["npm", "run", "dev"]
