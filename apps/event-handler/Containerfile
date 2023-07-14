FROM node:18-alpine3.16 as base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=event-handler --docker

FROM node:18-alpine3.16 as builder
WORKDIR /app
ARG app
RUN corepack enable

COPY .gitignore .gitignore

COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

# Build the app
COPY --from=base /app/out/full/ .
RUN pnpm turbo run build --filter=event-handler...

FROM node:18-alpine3.16 as runner
WORKDIR /app
ARG app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 service-user
USER service-user

ENV NODE_ENV production

COPY --from=builder /app .

CMD ["node", "apps/event-handler/dist/main.js"]