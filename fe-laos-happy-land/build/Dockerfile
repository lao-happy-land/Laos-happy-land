# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY next.config.js ./
COPY src ./src
COPY public ./public

# Build project
RUN pnpm build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_PUBLIC_SITE_URL=https://laohappyland.com

EXPOSE 3001

CMD ["pnpm", "start"]
