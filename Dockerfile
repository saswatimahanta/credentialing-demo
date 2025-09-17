# Multi-stage Dockerfile for Next.js 15 app

# 1) Install dependencies (with cache based on lockfile)
FROM node:20-alpine AS deps
WORKDIR /app

# Install OS deps if needed (e.g., sharp). Next 15 typically bundles it.
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package.json package-lock.json* ./

# Install dependencies using npm (lockfile present)
RUN npm ci --no-audit --no-fund

# 2) Build the application
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN npm run build

# 3) Production image with minimal runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy necessary files from builder (standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port used in package.json dev script (we'll use 9002)
EXPOSE 9002

# Next standalone server listens on PORT; set to 9002
ENV PORT=9002

# Start the Next.js app
CMD ["node", "server.js"]
