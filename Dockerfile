FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ARG BETTER_AUTH_SECRET=placeholder-build-secret-32-chars!!
ARG ORIGIN=http://localhost:3000
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV ORIGIN=$ORIGIN
RUN pnpm build

# ---

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/migrate.js ./migrate.js

EXPOSE 3000

CMD ["sh", "-c", "node migrate.js && node build"]
