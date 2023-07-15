FROM node:18-alpine3.16 as base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=frontend --docker

FROM node:18-alpine3.16 as builder
WORKDIR /app
RUN corepack enable

COPY .gitignore .gitignore

COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

# Build the app
COPY --from=base /app/out/full/ .
RUN pnpm turbo run build --filter=frontend...

FROM node:18-alpine3.16 as runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 service-user
USER service-user

ENV NODE_ENV production

COPY --from=builder /app /app

COPY --from=builder /app/apps/frontend/next.config.js .
COPY --from=builder /app/apps/frontend/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=service-user:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=service-user:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=service-user:nodejs /app/apps/frontend/public ./apps/frontend/public

CMD ["node", "apps/frontend/server.js"]