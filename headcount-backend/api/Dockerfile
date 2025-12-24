FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

FROM base AS dev

ENV IS_PRODUCTION=0

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Allows hot reload to work on windows
ENV WATCHPACK_POLLING=TRUE

CMD ["yarn", "dev"]

FROM base AS builder

# Env var defaults so the build doesn't error
ENV IS_PRODUCTION=1

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /app
COPY package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
