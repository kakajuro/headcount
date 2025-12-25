FROM node:24-alpine AS base


FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn --frozen-lockfile


FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV IS_DOCKERISED=1

# Allows hot reload to work on windows
ENV WATCHPACK_POLLING=TRUE

CMD ["yarn", "dev"]

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Prod image
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/

COPY package.json .

ENV IS_PRODUCTION=1
CMD ["node", "server.js"]
